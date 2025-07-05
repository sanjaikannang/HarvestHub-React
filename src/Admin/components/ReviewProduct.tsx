import React from "react";
import Modal from "../../Common/ui/Modal";
import { Spinner } from "../../Common/ui/Spinner";
import { CheckCircle, XCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../State/store";

interface ReviewProductProps {
    isOpen: boolean;
    onClose: () => void;
    selectedProductId: string | null;
    reviewStatus: 'APPROVED' | 'REJECTED';
    setReviewStatus: (status: 'APPROVED' | 'REJECTED') => void;
    adminFeedback: string;
    setAdminFeedback: (feedback: string) => void;
    onReviewSubmit: () => Promise<void>;
}

const ReviewProduct: React.FC<ReviewProductProps> = ({
    isOpen,
    onClose,
    reviewStatus,
    setReviewStatus,
    adminFeedback,
    setAdminFeedback,
    onReviewSubmit
}) => {
    const { reviewProductLoading } = useSelector((state: RootState) => state.admin);

    // Handle status change in modal
    const handleReviewStatusChange = (status: 'APPROVED' | 'REJECTED') => {
        setReviewStatus(status);
        // Clear feedback when switching to approved
        if (status === 'APPROVED') {
            setAdminFeedback('');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Review Product"
            size="lg"
        >
            {/* Action Buttons */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    Choose Action
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => handleReviewStatusChange('APPROVED')}
                        className={`flex items-center justify-center px-4 py-1.5 rounded-md font-medium focus:outline-none transition-colors cursor-pointer ${reviewStatus === 'APPROVED'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                    >
                        <CheckCircle size={20} className="mr-2" />
                        Approve Product
                    </button>
                    <button
                        onClick={() => handleReviewStatusChange('REJECTED')}
                        className={`flex items-center justify-center px-4 py-1.5 rounded-md font-medium focus:outline-none transition-colors cursor-pointer ${reviewStatus === 'REJECTED'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                    >
                        <XCircle size={20} className="mr-2" />
                        Reject Product
                    </button>
                </div>
            </div>

            {/* Admin Feedback (only shown when rejection is selected) */}
            {reviewStatus === 'REJECTED' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Rejection <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={adminFeedback}
                        onChange={(e) => setAdminFeedback(e.target.value)}
                        placeholder="Please provide a reason for rejection..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        This feedback will be sent to the farmer.
                    </p>
                </div>
            )}

            {/* Submit Button */}
            {(reviewStatus === 'APPROVED' || reviewStatus === 'REJECTED') && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={onReviewSubmit}
                        disabled={reviewProductLoading || (reviewStatus === 'REJECTED' && !adminFeedback.trim())}
                        className={`px-6 py-1.5 rounded-md text-white font-medium focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${reviewStatus === 'APPROVED'
                            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                            }`}
                    >
                        {reviewProductLoading ? (
                            <span className="flex items-center">
                                <div className="mr-2">
                                    <Spinner />
                                </div>
                                Processing...
                            </span>
                        ) : (
                            `Submit ${reviewStatus === 'APPROVED' ? 'Approval' : 'Rejection'}`
                        )}
                    </button>
                </div>
            )}
        </Modal>
    );
};

export default ReviewProduct;