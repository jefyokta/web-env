
void watchDir(const char* path);


int waitForChanges(int timeout_ms);


int getChangedFiles(char changed[][512], int max);


void stopWatching();

