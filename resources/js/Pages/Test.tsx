import { Link } from "@inertiajs/react";
import { useState } from "react";


const Test: React.FC = () => {

    const [count, setCount] = useState<number>(0);

    return <div>
        <div>{count}</div>
        <button onClick={() => setCount(1 + count)}>incremeant</button>
        <Link href={"/test"}>Spa Test</Link>

    </div>
}
export default Test;