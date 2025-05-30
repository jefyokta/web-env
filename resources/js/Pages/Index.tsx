import Card from "@/Components/Card"
import { Particle } from "@/Components/Icon/Particle"
import { Sun } from "@/Components/Icon/Sun"
import { Temperature } from "@/Components/Icon/Temperature"
import Application from "@/Layouts/Application"

const Index = () => {

    return <Application title="RealTime Data">
        <Card
            title="Temperature"
            Icon={Temperature}
            value={32}
            unit="°C"
            valueClassName="text-red-400"
            status="Panas"
            statusColor="bg-red-500"
        />

        <Card
            title="Dust"
            Icon={Particle}
            value={150}
            unit="µg/m³"
            valueClassName="text-yellow-400"
            status="Sedang"
            statusColor="bg-yellow-400"
        />

        <Card
            title="Light"
            Icon={Sun}
            value={500}
            unit="lux"
            valueClassName="text-green-400"
            status="Normal"
            statusColor="bg-green-500"
        />

    </Application>
}

export default Index