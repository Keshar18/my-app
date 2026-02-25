export default function Footer() {
  return (
    <footer className="border-t bg-white mt-20 py-10 px-6 md:px-16 text-sm text-gray-600">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-2">HolistiDoc AI</h3>
          <p>
            AI-powered holistic healthcare guidance combining modern medicine
            with natural wellness.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Platform</h4>
          <p>AI Consultation</p>
          <p>Dashboard</p>
          <p>About Us</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Support</h4>
          <p>Contact</p>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Disclaimer</h4>
          <p>
            HolistiDoc AI provides general wellness guidance only and is not a
            substitute for professional medical advice.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-400">
        © 2026 HolistiDoc AI. All rights reserved.
      </div>
    </footer>
  );
}