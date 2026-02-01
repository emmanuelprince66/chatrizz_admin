import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CheckCircle,
  ChevronRight,
  CreditCard,
  FileText,
  MapPin,
  Star,
} from "lucide-react";
const VerificationDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="bg-white border  border-gray-200 flex flex-col">
          {" "}
          {/* Added flex-col */}
          <SheetHeader>
            <SheetTitle>Verification Details</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-6 p-4">
            {/* Profile Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">Tobi Olosunde</h3>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-sm text-gray-500">@tobi_c</p>
              </div>
            </div>

            {/* Lloyd Payne Section */}
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">Lagos Nigeria</span>
            </div>

            {/* Laundry Service Rating */}
            <div className="">
              <div className="flex items-center space-x-2 mb-5">
                <h4 className="font-medium py-2 px-3 border border-gray-200 bg-gray-100 rounded-lg  text-gray-900">
                  Laundry Service
                </h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">3.5</span>
                  <span className="text-sm text-gray-500">from reviews</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Viverra eget eget sit
                quentas sed mauris. Neque pellentesque quam euismod...
              </p>
            </div>

            {/* Verification Status */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                Verification Status
              </h4>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-gray-900">
                    Business Account
                  </span>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                  Pending
                </span>
              </div>
            </div>

            {/* Submitted Docs */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Submitted Docs</h4>
              <div className="space-y-2">
                {/* CAC Registration */}
                <div className="flex cursor-pointer items-center justify-between p-5 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      CAC Registration
                    </span>
                  </div>
                  <div className="flex items-center border border-gray-200 hover:border-gray-400  justify-center bg-gray-100 w-8 h-8 rounded-full">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* ID Card */}
                <div className="flex cursor-pointer items-center justify-between p-5 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">ID Card</span>
                  </div>
                  <div className="flex items-center border border-gray-200 hover:border-gray-400  justify-center bg-gray-100 w-8 h-8 rounded-full">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Date */}
            <div className="text-sm text-gray-500">
              Submitted on: 25-08-2025
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 gap-3 border-t border-gray-200">
              <button className="flex-1 flex items-center cursor-pointer justify-center space-x-2 px-4 py-3 bg-gray-100 border border-gray-200 text-white rounded-lg font-medium  transition-colors">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-black">Approve</span>
              </button>
              <button className="flex-1 flex cursor-pointer items-center justify-center space-x-2 px-4 py-3 bg-gray-100 border border-gray-200 text-white rounded-lg font-medium  transition-colors">
                <span className="w-4 h-4 flex items-center justify-center text-red-500   font-bold">
                  ✕
                </span>
                <span className="text-black">Reject</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default VerificationDrawer;
