import type { Metadata } from "next";
import { type ReactElement, type ReactNode } from "react";

import { Footer, Navbar } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Privacy Policy | Coastal PASS",
  description:
    "Learn how Coastal PASS collects, uses, and protects information within our applications.",
};

const PrivacyPage = (): ReactElement => (
  <>
    <Navbar />
    <main className="mx-auto max-w-4xl px-4 py-20">
      <article className="space-y-6 text-brand-body">
        <h1 className="text-3xl font-semibold text-brand-heading">
          Privacy Policy
        </h1>
        <p>
          This privacy policy applies to the Coastal PASS app (hereby referred
          to as &quot;Application&quot;) for mobile devices that was created by
          Coastal Tractor (hereby referred to as &quot;Service Provider&quot;)
          as a Free service. This service is intended for use &quot;AS IS&quot;.
        </p>
        <Section title="Information Collection and Use">
          <p>
            The Application collects information when you download and use it.
            This information may include information such as:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              Your device&apos;s Internet Protocol address (e.g. IP address).
            </li>
            <li>
              The pages of the Application that you visit, the time and date of
              your visit, the time spent on those pages.
            </li>
            <li>The time spent on the Application.</li>
            <li>The operating system you use on your mobile device.</li>
          </ul>
          <p>
            The Application does not gather precise information about the
            location of your mobile device.
          </p>
          <p>
            The Application collects your device&apos;s location, which helps
            the Service Provider determine your approximate geographical
            location and make use of in the below ways:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Geolocation Services:</strong> The Service Provider
              utilizes location data to provide features such as personalized
              content, relevant recommendations, and location-based services.
            </li>
            <li>
              <strong>Analytics and Improvements:</strong> Aggregated and
              anonymized location data helps the Service Provider to analyze
              user behavior, identify trends, and improve the overall
              performance and functionality of the Application.
            </li>
            <li>
              <strong>Third-Party Services:</strong> Periodically, the Service
              Provider may transmit anonymized location data to external
              services. These services assist them in enhancing the Application
              and optimizing their offerings.
            </li>
          </ul>
        </Section>
        <p>
          The Service Provider may use the information you provided to contact
          you from time to time to provide you with important information,
          required notices and marketing promotions.
        </p>
        <Section title="Third Party Access">
          <p>
            Only aggregated, anonymized data is periodically transmitted to
            external services to aid the Service Provider in improving the
            Application and their service. The Service Provider may share your
            information with third parties in the ways that are described in
            this privacy statement.
          </p>
          <p>
            Please note that the Application utilizes third-party services that
            have their own Privacy Policy about handling data. Below are the
            links to the Privacy Policy of the third-party service providers
            used by the Application:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <a
                href="https://www.google.com/policies/privacy/"
                className="text-brand-primary underline"
                target="_blank"
                rel="noreferrer"
              >
                Google Play Services
              </a>
            </li>
            <li>
              <a
                href="https://firebase.google.com/support/privacy"
                className="text-brand-primary underline"
                target="_blank"
                rel="noreferrer"
              >
                Google Analytics for Firebase
              </a>
            </li>
            <li>
              <a
                href="https://firebase.google.com/support/privacy/"
                className="text-brand-primary underline"
                target="_blank"
                rel="noreferrer"
              >
                Firebase Crashlytics
              </a>
            </li>
          </ul>
          <p>
            The Service Provider may disclose User Provided and Automatically
            Collected Information:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              as required by law, such as to comply with a subpoena, or similar
              legal process;
            </li>
            <li>
              when they believe in good faith that disclosure is necessary to
              protect their rights, protect your safety or the safety of others,
              investigate fraud, or respond to a government request;
            </li>
            <li>
              with their trusted services providers who work on their behalf, do
              not have an independent use of the information disclosed to them,
              and have agreed to adhere to the rules set forth in this privacy
              statement.
            </li>
          </ul>
        </Section>
        <Section title="Opt-Out Rights">
          <p>
            You can stop all collection of information by the Application easily
            by uninstalling it. You may use the standard uninstall processes as
            may be available as part of your mobile device or via the mobile
            application marketplace or network.
          </p>
        </Section>
        <Section title="Data Retention Policy">
          <p>
            The Service Provider will retain User Provided data for as long as
            you use the Application and for a reasonable time thereafter. If
            you&apos;d like them to delete User Provided Data that you have
            provided via the Application, please contact them at{" "}
            <a
              href="mailto:appdev@coastalpass.services"
              className="text-brand-primary underline"
            >
              appdev@coastalpass.services
            </a>{" "}
            and they will respond in a reasonable time.
          </p>
        </Section>
        <Section title="Children">
          <p>
            The Service Provider does not use the Application to knowingly
            solicit data from or market to children under the age of 13.
          </p>
          <p>
            The Application does not address anyone under the age of 13. The
            Service Provider does not knowingly collect personally identifiable
            information from children under 13 years of age. If a child under 13
            has provided personal information, the Service Provider will delete
            it from their servers. If you are a parent or guardian and you are
            aware that your child has provided us with personal information,
            please contact the Service Provider at{" "}
            <a
              href="mailto:appdev@coastalpass.services"
              className="text-brand-primary underline"
            >
              appdev@coastalpass.services
            </a>{" "}
            so that they can take the necessary actions.
          </p>
        </Section>
        <Section title="Security">
          <p>
            The Service Provider is concerned about safeguarding the
            confidentiality of your information. Physical, electronic, and
            procedural safeguards protect information the Service Provider
            processes and maintains.
          </p>
        </Section>
        <Section title="Changes">
          <p>
            This Privacy Policy may be updated from time to time for any reason.
            The Service Provider will notify you of any changes by posting the
            new Privacy Policy at
          </p>
          <a
            href="https://www.coastalpass.services/privacy"
            className="text-brand-primary underline"
            target="_blank"
            rel="noreferrer"
          >
            https://www.coastalpass.services/privacy
          </a>
          <p>
            You are advised to consult this Privacy Policy regularly for any
            changes, as continued use is deemed approval of all changes.
          </p>
        </Section>
        <Section title="Your Consent">
          <p>
            By using the Application, you are consenting to the processing of
            your information as set forth in this Privacy Policy now and as
            amended by us.
          </p>
        </Section>
        <Section title="Contact Us">
          <p>
            If you have any questions regarding privacy while using the
            Application, or have questions about our practices, please contact
            the Service Provider at
          </p>
          <a
            href="mailto:appdev@coastalpass.services"
            className="text-brand-primary underline"
          >
            appdev@coastalpass.services
          </a>
        </Section>
      </article>
    </main>
    <Footer />
  </>
);

export default PrivacyPage;

interface SectionProps {
  readonly title: string;
  readonly children: ReactNode;
}

const Section = ({ title, children }: SectionProps): ReactElement => (
  <section className="space-y-4">
    <h2 className="text-2xl font-semibold text-brand-heading">{title}</h2>
    {children}
  </section>
);
