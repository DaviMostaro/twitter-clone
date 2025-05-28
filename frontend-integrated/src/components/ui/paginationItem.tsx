"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

type Props = {
    backAction: () => void;
    nextAction: () => void;
    page: number;
    hasMore: boolean;
};

export const PaginationItem = ({page, backAction, nextAction, hasMore}: Props) => {
    return (
        <div className="flex justify-center items-center gap-8 py-6">
            <div onClick={backAction} className="cursor-pointer rounded-full hover:bg-blue-500 w-12 h-12 flex items-center justify-center">
                <FontAwesomeIcon icon={faArrowLeft} className="size-10" />
            </div>

            <div className="rounded-full p-3 text-white bg-blue-500 w-12 h-12 flex items-center justify-center">
                {page + 1}
            </div>

            <div 
                onClick={hasMore ? nextAction : undefined} 
                className={`cursor-pointer rounded-full hover:bg-blue-500 w-12 h-12 flex items-center justify-center ${!hasMore ? "opacity-50 pointer-events-none" : ""}`}
            >
                <FontAwesomeIcon icon={faArrowRight} className="size-10" />
            </div>
        </div>
    )
}