import React from 'react';
import './PrivacyPolicyPage.css';

const SITE_URL = 'https://isaahasi.org/';
const EMAIL = 'isaahasiindia@gmail.com';

const ExternalLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a className="privacy-link" href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

const EmailLink: React.FC = () => <ExternalLink href={`mailto:${EMAIL}`}>{EMAIL}</ExternalLink>;

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="privacy-page">
      <h1 className="privacy-title">Privacy Policy</h1>

      <div className="privacy-content">
        <p>
          iSaahasi Academy India Foundation respects and cares about how information about you is
          used and shared, and we appreciate you trusting that we will do so carefully and
          sensibly. To better protect your privacy, we provide this Privacy Policy explaining our
          online information practices and the choices you can make about the way your information
          is collected and used on this website.
        </p>
        <p>
          The information below explains our policy regarding your privacy and the{' '}
          <ExternalLink href={SITE_URL}>{SITE_URL}</ExternalLink> on the website. By visiting the
          website you are accepting the practices described in this Privacy Notice.
        </p>
        <p>
          Our <ExternalLink href={SITE_URL}>{SITE_URL}</ExternalLink> in website is maintained by
          iSaahasi with its office situated at Rita Inas Sadan, Manikpur Naka, Vasai west, Pin code
          401202.
        </p>

        <h2>WHAT PERSONALLY IDENTIFIABLE INFORMATION IS COLLECTED ON :</h2>
        <p>iSaahasi collects and uses personal information from visitors to its website.</p>
        <p>
          If you voluntarily provide personal information such as your name, address, email, phone
          number, or payment details, iSaahasi collects and stores that information.
        </p>
        <p>This information is used for purposes like:</p>
        <ul>
          <li>Registering you for newsletters or updates.</li>
          <li>Responding to your inquiries.</li>
          <li>Processing donations.</li>
          <li>Fulfilling merchandise orders.</li>
          <li>Handling requests or forms submitted through the website.</li>
        </ul>
        <p>The organization collects only the information that you choose to provide.</p>
        <p>
          Your information is stored and used in accordance with applicable laws, regulations, and
          organizational policies.
        </p>
        <p>
          Providing personal information is optional. However, if you choose not to provide the
          required information, iSaahasi may be unable to process your request, donation, or order.
        </p>
        <p>
          You can still browse the website without providing any personal information or
          identifying yourself
        </p>

        <h2>THE WAY WE USE INFORMATION</h2>
        <p>
          iSaahasi uses and protects the personal information you provide. Here&apos;s a simplified
          summary:
        </p>
        <ul>
          <li>
            Personal information is used only for the purpose for which you provide it (e.g.,
            donations, merchandise purchases, job applications, or information requests).
          </li>
          <li>
            Information provided for merchandise orders is used only to process, ship, and confirm
            delivery of your order.
          </li>
          <li>
            Personal information is not shared with third parties, except when necessary to
            complete an order (such as with shipping providers).
          </li>
          <li>
            You will receive updates about projects, services, or merchandise only if you
            voluntarily register for them.
          </li>
          <li>
            Email addresses are used only to respond to your inquiries and are not used for other
            purposes.
          </li>
          <li>
            iSaahasi does not sell, rent, share, or give away your email address or other personal
            information to outside organizations.
          </li>
          <li>
            <strong>If the organization changes how it uses your personal information, it will:</strong>
            <ul>
              <li>Make reasonable efforts to obtain your consent by email.</li>
              <li>
                Post the updated privacy policy on its website at least 30 days before the changes
                take effect.
              </li>
            </ul>
          </li>
        </ul>

        <h2>OUR COMMITMENT TO DATA SECURITY</h2>
        <p>
          Personally identifiable information (PII) is securely stored on iSaahasi’s servers and is
          not publicly accessible.
        </p>
        <p>
          Access to personal information is restricted to authorized personnel who need it to
          perform their job duties.
        </p>
        <p>
          ISaahasi has implemented physical, electronic, and administrative security measures to:
        </p>
        <ul>
          <li>Prevent unauthorized access.</li>
          <li>Maintain the accuracy of data.</li>
          <li>Ensure information is used appropriately.</li>
        </ul>
        <p>
          Sensitive information, such as credit card details, is protected using SSL encryption and
          other industry-standard security measures to help keep your data secure.
        </p>

        <h2>CHOICE/OPT-OUT</h2>
        <p>
          If you have registered to receive e-mail communications from us and later change your
          mind, you may contact us to have your name removed from our distribution lists. You have
          the following options to do this: You can send an e-mail to: <EmailLink />
        </p>

        <h2>CORRECT/UPDATE</h2>
        <p>
          If you would like to verify the data we have received from you or to make corrections to
          it, you may contact us directly at the e-mail address provided.
        </p>

        <h2>WHAT ANONYMOUS INFORMATION IS COLLECTED ON THIS SITE?</h2>
        <p>
          Anonymous information is collected for every visitor to this site. This includes pages
          viewed, date and time, and browser type. IP numbers are not stored, but are temporarily
          used to determine domain type and in some cases, geographic region. We do not make any
          association between this information and a visitor’s identity.
        </p>

        <h2>AUTOMATIC INFORMATION</h2>
        <p>
          When you visit our website, our servers make a log of basic information corresponding to
          the sites and pages you have visited. This information is stored primarily to track the
          effectiveness of our website and individual sections and pages within them.
        </p>

        <h2>HOW DOES THIS SITE USE COOKIES?</h2>
        <p>
          Cookies are simple text files stored by your web browser that provide a method of
          distinguishing among visitors to the website. Saahasi uses cookies to identify your
          browser as you visit pages on the iSaahasi website or sites in the iSaahasi media
          network. Cookies created on your computer by using our website do not contain personally
          identifiable information and do not compromise your privacy or security. Cookies allow
          iSaahasi to gather anonymous information. Cookies also allow ISaahasi to provide more
          relevant, targeted content as you travel through sites in the Saahasi media network as
          appropriate and are used on our ordering website to keep track of the items in your
          shopping cart.
        </p>

        <h2>ONLINE REGISTRATION INFORMATION</h2>
        <p>
          You will provide us with information about yourself and your organization when you
          register for fundraising, donations, updates, and / or to buy products. This information
          is not used for any other purpose than to fulfill your request and is not shared with
          outside parties. However, visitors should be aware that information collected through the
          Saahasi web site may be subject to examination and inspection if such information is a
          public record or not otherwise protected from disclosure.
        </p>

        <h2>LINKS</h2>
        <p>
          This website may contain links to other Web sites. Please note that when you click on one
          of these links, you are entering another site. We encourage you to read the privacy
          statements of these linked websites as their privacy policy may differ from ours.
        </p>

        <h2>E-MAIL LINKS</h2>
        <p>
          We use e-mail links located on this site to allow you to contact us directly via e-mail.
          We use the information provided in your e-mail to respond to your questions or comments.
          We may also store your comments for future reference.
        </p>

        <h2>EMAIL COMMUNICATIONS</h2>
        <p>
          We publish an e-newsletter that is sent periodically to persons on a subscription list.
          You may subscribe to or unsubscribe from the list at any time. Occasionally we may send
          announcements about ISaahasi events or merchandise to the mailing list. This e-mail
          address is being protected from spambots. You need JavaScript enabled to view it.
        </p>

        <h2>CHANGES TO THIS PRIVACY STATEMENT</h2>
        <p>
          Changing business practices and circumstances may require that we make changes to this
          privacy policy from time to time. Any changes will be reflected on this website.
          ISaahasi reserves the right to modify its website and/or this Privacy Policy at any time
          and users are deemed to be apprised of and bound by any such modifications. Our goal is
          to provide all services to visitors to the iSaahasi website in an accessible, efficient
          and friendly manner while maintaining their privacy. If you have comments or questions
          regarding privacy, please contact us.
        </p>

        <h2>LEGAL DISCLAIMER</h2>
        <p>
          We may disclose personal information when required by law or in the good-faith belief
          that such action is necessary in order to conform to the edicts of the law or comply with
          legal process served on iSaahasi.
        </p>

        <h2>FOR MORE INFORMATION</h2>
        <p>
          If you have any questions, concerns or comments about privacy at our{' '}
          <ExternalLink href="http://isaahasi.org">isaahasi.org</ExternalLink> website, please send
          us a description of your concern via e-mail to <EmailLink />
        </p>
      </div>
    </div>
  );
};
