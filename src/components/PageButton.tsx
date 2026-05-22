interface PageButtonProps {
    text: string;
    selected?: boolean
    onClick: () => void;
}

function PageButton({text, selected=false, onClick} : PageButtonProps) {
    return (
        <button
            onClick={onClick}
            className={
                `flex justify-center items-center w-10 h-10
                rounded-sm transition-colors duration-100
                ${selected ? "bg-green-600 text-white" : "hover:cursor-pointer text-gray-700 bg-white hover:bg-gray-200"}`
            }
        >
            {text}
        </button>
    )
}

export default PageButton;