import react, { useState } from "react";
import { useNavigate } from "react-router";

const PrivacyPolicyModal=({ showModal, closeModal })=>{
    
    if (!showModal){
        return ;
    }else{
        
    return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={closeModal} className="close-btn">Close</button>
        <div className="welcome-container">
        <h4>
        Privacy Policy:
        </h4>
            <p>Effective Date: 9th March 2025</p>
            Thank you for using our App VibeSphere. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your information when you sign in to and use our social media platform.

    By signing up or logging into VibeSphere, you agree to the practices described in this Privacy Policy. Please read this document carefully before proceeding.
        </div>
        <div>
            <h4>1. Information We Collect</h4>
            <p>We may collect the following types of information when you use our platform:</p>
            <ul>
                <li><b>Personal Information:</b> This includes information you provide during sign-up, such as your name, email address, phone number, profile picture, and other personal details.</li>
                <li><b>User-Generated Content:</b> Any content you create and share on the platform, including posts, comments, photos, videos, and other media.</li>
                <li><b>Usage Information:</b> Information about how you interact with our app, including IP addresses, device information, browser type, and activity on the platform (e.g., pages visited, actions taken).</li>
                <li><b>Location Data:</b> If you enable location services, we may collect information about your device's location.</li>
                <li><b>Cookies and Tracking Technologies:</b> We use cookies and similar technologies to enhance your user experience, analyze trends, and improve the platform.</li>
            </ul>
        </div>
        <div>
            <h4>2. How We Use Your Information</h4>
            <p>We may use the information we collect for the following purposes:</p>
            <ul>
                <li><b>Account Management:</b> To create and manage your user account, communicate with you, and provide customer support.</li>
                <li><b>Platform Features:</b> To enable social interactions, such as posting content, commenting, messaging, and following other users.</li>
                <li><b>Personalization:</b> To personalize content, recommendations, and advertisements based on your activity and preferences.</li>
                <li><b>Improvement of Services:</b> To analyze user behavior and improve our app, add new features, and enhance security.</li>
                <li><b>Legal Compliance:</b> To comply with applicable laws, regulations, or legal processes, or to protect the rights, property, and safety of our users.</li>

            </ul>
        </div>
        <div className="how-we-protect-info">
            <h4>3. How We Protect Your Information</h4>
            <p>We take the security of your personal information seriously and implement reasonable technical, administrative, and physical safeguards to protect your data. However, no method of data transmission over the internet or electronic storage is 100% secure, and we cannot guarantee its absolute security.</p>

        </div>
        <div className="sharing-your-info">
            <h4>4. Sharing Your Information</h4>
            <p>We do not sell, rent, or trade your personal information to third parties. However, we may share your information in the following situations:</p>
            <ul>
                <li><b>With Service Providers:</b> We may share information with third-party vendors, contractors, and service providers who help us operate and improve our platform (e.g., cloud hosting, analytics services, email providers).</li>
                <li><b>For Legal Reasons:</b> We may disclose your information to comply with a legal obligation, enforce our terms of service, or protect the rights, property, or safety of our users or the public.</li>
                <li><b>With Your Consent:</b> We may share your information when you give us explicit consent, such as when you opt into third-party integrations.</li>
            </ul>
        </div>
        <div className="your-rights-and-choice">
            <h4>5. Your Rights and Choices</h4>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
                <li><b>Access and Update:</b> You can access, update, or delete your personal information by visiting your account settings or contacting us directly.</li>
                <li><b>Opt-Out:</b> You can opt out of receiving promotional emails by clicking the “unsubscribe” link in the email or adjusting your notification settings in the app.</li>
                <li><b>Data Retention:</b> We will retain your information for as long as your account is active or as needed to fulfill the purposes outlined in this Privacy Policy. You can request to delete your account at any time.</li>
            </ul>
        </div>
        <div className="third-party-links">
            <h4>6. Third-Party Links and Services</h4>
            <p>Our platform may contain links to third-party websites or services that are not controlled by us. We are not responsible for the privacy practices of these third parties. Please review their privacy policies before sharing your information with them.</p>
        </div>
        <div className="childrens-policy">
            <h4>7. Children’s Privacy</h4>
            <p>Our platform is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.</p>
        </div>
        <div className="changes">
            <h4>8. Changes to This Privacy Policy</h4>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the effective date will be updated accordingly. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.</p>
        </div>
        <div className="Contact Us">
            <h4>9. Contact Us</h4>
            <p>If you have any questions about this Privacy Policy or how we handle your personal information, please contact us at:</p>
        </div>

        <p><i>By clicking "Agree" or "Sign In," you acknowledge that you have read and understood this Privacy Policy and agree to its terms.</i></p>
        <br></br>
        <div >
        <button className="delete-btn" onClick={() => closeModal(false)}> Don't agree</button>
        <button className="update-btn" onClick={() => closeModal(true)} > I Agree </button>
        </div>
        
      </div>
    </div>)

    }
}

export default PrivacyPolicyModal;