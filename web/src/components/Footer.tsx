/* File: web/src/components/Footer.tsx */
export default function Footer() {
    return (
      <footer className="bg-gray-100 mt-auto py-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Payout Automation. All rights reserved.
        </div>
      </footer>
    );
  }
  