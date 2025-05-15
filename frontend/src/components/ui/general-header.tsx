import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type Props = {
    children: React.ReactNode;
    backHref: string;   
}

export const GeneralHeader = ({children, backHref}: Props) => {
    return (
        <header className="flex gap-4 items-center p-6">
            <Link href={backHref} className="flex justify-center items-center border-2 border-gray-500 size-12 rounded-full">
                <FontAwesomeIcon icon={faArrowLeft} className="size-6" />
            </Link>
            <div className="flex-1">{children}</div>
        </header>
    );
}