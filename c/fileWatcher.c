#include "fileWatcher.h"
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>
#include <sys/types.h>
#include <sys/event.h>
#include <sys/time.h>
#include <dirent.h>
#include <pthread.h>
#include <errno.h>
#include <sys/stat.h>
#include <unistd.h>


#define MAX_WATCHED_FILES 256
#define MAX_PATH_LEN 512

static int kq = -1;
static int watchFd = -1;
static char watchPath[MAX_PATH_LEN] = {0};

static char changedFiles[MAX_WATCHED_FILES][MAX_PATH_LEN];
static int changedCount = 0;

static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

static int isDir = 0;

static void clearChangedFiles();
static void addChangedFile(const char* filename);
static int scanDirFiles(const char* dirPath, int fds[], int maxFds);

static void clearChangedFiles() {
    pthread_mutex_lock(&lock);
    changedCount = 0;
    pthread_mutex_unlock(&lock);
}

static void addChangedFile(const char* filename) {
    pthread_mutex_lock(&lock);
    if (changedCount < MAX_WATCHED_FILES) {
        strncpy(changedFiles[changedCount], filename, MAX_PATH_LEN - 1);
        changedFiles[changedCount][MAX_PATH_LEN-1] = '\0';
        changedCount++;
    }
    pthread_mutex_unlock(&lock);
}


static int scanDirFiles(const char* dirPath, int fds[], int maxFds) {
    DIR* dir = opendir(dirPath);
    if (!dir) return -1;

    struct dirent* entry;
    int count = 0;
    while ((entry = readdir(dir)) != NULL && count < maxFds) {
        if (entry->d_type == DT_REG) {
            char fullPath[MAX_PATH_LEN];
            snprintf(fullPath, sizeof(fullPath), "%s/%s", dirPath, entry->d_name);

            int fd = open(fullPath, O_EVTONLY);
            if (fd >= 0) {
                fds[count++] = fd;
            }
        }
    }
    closedir(dir);
    return count;
}

void watchDir(const char* path) {
    stopWatching();

    strncpy(watchPath, path, sizeof(watchPath) - 1);
    watchPath[sizeof(watchPath) - 1] = '\0';


    struct stat st;
    if (stat(watchPath, &st) < 0) {
        perror("stat");
        return;
    }
    isDir = S_ISDIR(st.st_mode);

    kq = kqueue();
    if (kq < 0) {
        perror("kqueue");
        return;
    }

    clearChangedFiles();

    if (isDir) {
        int fds[MAX_WATCHED_FILES];
        int n = scanDirFiles(watchPath, fds, MAX_WATCHED_FILES);
        if (n < 0) {
            perror("scanDirFiles");
            close(kq);
            kq = -1;
            return;
        }
        for (int i = 0; i < n; i++) {
            struct kevent change;
            EV_SET(&change, fds[i], EVFILT_VNODE, EV_ADD | EV_CLEAR,
                   NOTE_WRITE | NOTE_EXTEND | NOTE_ATTRIB | NOTE_DELETE | NOTE_RENAME, 0, NULL);
            if (kevent(kq, &change, 1, NULL, 0, NULL) < 0) {
                perror("kevent register");
            }
        }
    } else {
        watchFd = open(watchPath, O_EVTONLY);
        if (watchFd < 0) {
            perror("open watch file");
            close(kq);
            kq = -1;
            return;
        }
        struct kevent change;
        EV_SET(&change, watchFd, EVFILT_VNODE, EV_ADD | EV_CLEAR,
               NOTE_WRITE | NOTE_EXTEND | NOTE_ATTRIB | NOTE_DELETE | NOTE_RENAME, 0, NULL);
        if (kevent(kq, &change, 1, NULL, 0, NULL) < 0) {
            perror("kevent register file");
            close(watchFd);
            close(kq);
            watchFd = -1;
            kq = -1;
            return;
        }
    }
}

int waitForChanges(int timeout_ms) {
    if (kq < 0) return -1;

    struct kevent event;
    struct timespec ts;
    struct timespec* pts = NULL;

    if (timeout_ms > 0) {
        ts.tv_sec = timeout_ms / 1000;
        ts.tv_nsec = (timeout_ms % 1000) * 1000000;
        pts = &ts;
    }

    int nev = kevent(kq, NULL, 0, &event, 1, pts);
    if (nev < 0) {
        perror("kevent wait");
        return -1;
    } else if (nev == 0) {
        return 0;
    } else {
        if (event.filter == EVFILT_VNODE) {
            if (isDir) {
              
                addChangedFile(watchPath);
            } else {
                addChangedFile(watchPath);
            }
            return 1;
        }
    }
    return 0;
}

int getChangedFiles(char changed[][512], int max) {
    pthread_mutex_lock(&lock);
    int count = changedCount < max ? changedCount : max;
    for (int i = 0; i < count; i++) {
        strncpy(changed[i], changedFiles[i], 512 - 1);
        changed[i][511] = '\0';
    }
    changedCount = 0;
    pthread_mutex_unlock(&lock);
    return count;
}

void stopWatching() {
    if (watchFd >= 0) {
        close(watchFd);
        watchFd = -1;
    }
    if (kq >= 0) {
        close(kq);
        kq = -1;
    }
    clearChangedFiles();
}
