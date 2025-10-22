import DocumentTitle from "../DocumentTitle";
import scss from "./policy.module.scss";
import clsx from "clsx";


const PrivacyPolicy = () => {
  return (
    <>
    <DocumentTitle title="Privacy Policy"/>
      <div className={scss.policy_page}>

        <div className="banner">
          <img
            src={`${import.meta.env.VITE_BASE}assets/images/slider1.jpeg`}
            alt="Banner"
            className={clsx(
              scss.banner_image,
              "w-full max-h-[400px] object-cover"
            )}
          />
        </div>
        <div className={"flex justify-center"}>
          <div className="container">
            <div className={scss.destination_title}>
              <h2 className={clsx(scss.cattitle, "mt-5")}>Privacy Policy</h2>
            </div>
            <div className={scss.privacy_content_wrapper}>
              <div className={scss.title_content}>
                <p>Effective Date: Aug 01, 2025 </p>
                <p>
                  The JK Tourism ("we", "our", or "us") is committed to ensuring
                  the privacy and protection of user's personal information.
                  This Privacy Policy outlines how we collect, use, disclose,
                  and safeguard your information when you use the JK Tourism
                  Mobile & Web Application which is operated by the Department
                  of Tourism, Government of Jammu & Kashmir.
                </p>
              </div>
              <div className={scss.content_wrapper}>
                <div className={scss.content_block}>
                  <h4>1. Information We Collect</h4>
                  <ul>
                    <li>
                      Personal Information: Name, mobile number, email address,
                      or any other details you provide through contact forms,
                      feedback, or registrations (if any).
                    </li>
                    <li>
                      Device & Usage Data: This may include device model,
                      operating system, IP address, browser type, and usage
                      patterns for performance and analytics.
                    </li>
                    <li>
                      Location Data (if enabled): With your consent, we may
                      access GPS or approximate location to help you discover
                      nearby tourist destinations or services.
                    </li>
                    <li>
                      Media Access (optional): If the app provides photo sharing
                      or feedback with attachments, we may request access to
                      your gallery or camera.
                    </li>
                  </ul>
                </div>
                <div className={scss.content_block}>
                  <h4>2. How We Use Your Information</h4>
                  <ul>
                    <li>Improve app functionality and user experience</li>
                    <li>
                      Provide personalized tourism services and suggestions
                    </li>
                    <li>Process feedback and handle queries</li>
                    <li>Monitor app usage for maintenance and development</li>
                    <li>Comply with legal or regulatory obligations</li>
                  </ul>
                </div>
                <div className={scss.content_block}>
                  <h4>3. Data Sharing and Disclosure</h4>
                  <p>
                    We do not sell your personal data. However, we may share
                    information with:
                  </p>
                  <ul>
                    <li>
                      Government departments or tourism stakeholders for
                      coordination
                    </li>
                    <li>
                      Authorized service providers helping in app operations or
                      analytics
                    </li>
                    <li>
                      Legal or regulatory authorities when required by law
                    </li>
                  </ul>
                </div>
                <div className={scss.content_block}>
                  <h4>4. Data Security</h4>
                  <ul>
                    <li>
                      We use secure servers and protocols to safeguard your
                      information. However, while we strive to protect your
                      data, no system can be guaranteed 100% secure.
                    </li>
                  </ul>
                </div>
                <div className={scss.content_block}>
                  <h4>5. Your Rights</h4>
                  <ul>
                    <li>Request access or correction of your personal data.</li>
                    <li>
                      Withdraw consent for certain data access (e.g., location
                      or media).
                    </li>
                    <li>
                      Request deletion of your information (where applicable).
                    </li>
                  </ul>
                </div>
                <div className={scss.content_block}>
                  <h4>6. Third-Party Services</h4>
                  <ul>
                    <li>
                      The app may include links to third-party websites or
                      services (e.g., booking portals, maps). We are not
                      responsible for their privacy practices and encourage you
                      to review their policies.
                    </li>
                  </ul>
                </div>
                <div className={scss.content_block}>
                  <h4>7. Children's Privacy</h4>
                  <ul>
                    <li>
                      This App is not designed for children under the age of 13.
                      We do not knowingly collect personal data from children.
                    </li>
                  </ul>
                </div>
                <div className={scss.content_block}>
                  <h4>8. Policy Updates</h4>
                  <ul>
                    <li>
                      We may update this Privacy Policy from time to time. You
                      will be notified of any material changes via the app or on
                      our official website.
                    </li>
                  </ul>
                </div>
                <div className={scss.content_block}>
                  <h4>9. Contact Us</h4>
                  <p>
                    For any questions or concerns related to this Privacy
                    Policy, you may contact:
                  </p>
                  <ul>
                    <li>Department of Tourism, J&K Government</li>
                    <li>Tourist Reception Centre (TRC), Srinagar, Kashmir</li>
                    <li>
                      <strong>Email</strong>: dirtourism-kashmir@jk.gov.in,
                      directortourismkmr@gmail.com
                    </li>
                    <li>
                      <strong>Phone</strong>: 0194-2502279, 0194-2502512
                    </li>
                    <li>
                      <strong>Helpline</strong>: +91-8899931010, +91-8899941010
                    </li>
                    <li>
                      <strong>Website</strong>:{" "}
                      <a
                        href="https://www.jandktourism.jk.gov.in"
                        className="underline text-blue-500"
                        target="_blank"
                      >
                        https://www.jandktourism.jk.gov.in
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy