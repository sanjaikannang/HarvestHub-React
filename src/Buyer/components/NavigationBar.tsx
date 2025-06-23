import { ArrowLeft } from "lucide-react"


interface NavigationBarProps {
    title: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
}


const NavigationBar: React.FC<NavigationBarProps> = ({ title, showBackButton = false, onBackClick }) => {
    return (
        <>
            <div className="shadow-sm">
                <div className="max-w-9xl mx-auto px-4">
                    <div className="flex items-center h-14">
                        {showBackButton && (
                            <button
                                onClick={onBackClick}
                                className="mr-2 text-gray-600 cursor-pointer"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h2 className="text-md font-semibold text-gray-900">{title}</h2>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavigationBar