import {
  HeaderSection,
  LogoContainer,
} from "@/pages/webLayout/shared/components/Header/styles";
import { SvgIcon } from "@/pages/webLayout/shared/common/SvgIcon";
import { Card, Col, Row, Typography } from "antd";
import React, { FC, Suspense, lazy } from "react";
import styles from "./index.module.less";

const CookiePolicy: FC = () => {
  const Container = lazy(() => import("../webLayout/shared/common/Container"));
  return (
    <Suspense>
      <HeaderSection>
        <Container>
          <Row justify="space-between">
            <LogoContainer to="/" aria-label="homepage">
              <SvgIcon
                src={`${import.meta.env.VITE_BASE_URL}/vocabulift_logo.svg`}
                width="120px"
                height="64px"
              />
            </LogoContainer>
          </Row>
        </Container>
      </HeaderSection>
      <Container>
        <Row justify="space-between" align="middle">
          <Col span={2} />
          <Col span={20}>
            <Card
              style={{ marginTop: "120px", marginBottom: "120px" }}
              className={styles.cardStyle}
            >
              <Typography.Title level={1}>Cookie Policy</Typography.Title>
              <Typography.Text>
                During your visits to the Website www.vocabulift.com, cookies
                may be stored on your terminal. This Cookie Policy aims to
                inform you of i) the ways in which we use cookies on your
                terminal, ii) their purposes and iii) your rights regarding the
                use of these cookies. This Cookie Policy is compliant with the
                requirements of the General Data Protection Regulation (EU)
                2016/679 of April 27th, 2016 (“GDPR”) regarding the use of
                cookies. This Cookie Policy is applicable by the sole fact of
                its publication on our website and does not replace our Privacy
                Policy.
              </Typography.Text>
              <Typography.Title level={1}>What are cookies?</Typography.Title>
              <Typography.Text>
                Cookies are small text files stored and/or read by your browser
                on your terminal when you are visiting the Website. These
                cookies allow us to store information and identify the terminal
                you are using. Cookies are used on various platforms (website,
                e-mail, mobile applications, other). They have two main
                purposes: enabling the proper functioning of the website through
                the study of technical statistics or of the identification of
                error messages ; improving your experience by configuring the
                use of the environment according to your preferences. Cookies
                allow us to process some of your personal data, such as, but not
                limited to your IP address or the date and time of your
                connection.
              </Typography.Text>
              <Typography.Title level={1}>
                What cookies do we use?
              </Typography.Title>
              <Typography.Text>
                Our website uses the following cookies: Google analytics: 3
                cookies (i)_ga to distinguish users, (ii) _gid to distinguish
                users and (iii)_gat to throttle request rate)
              </Typography.Text>
              <Typography.Title level={1}>Recipients</Typography.Title>
              <Typography.Text>
                Access to personal data that we collect through cookies is
                limited to both internal and external recipients: internally,
                personal data is only accessible to authorized departments of
                Vocabulift, if necessary; externally, personal data is only
                accessible to our technical service providers who can place
                cookies on your terminal and/or administer them and access the
                related personal data.
              </Typography.Text>
              <Typography.Title level={1}>Retention period</Typography.Title>
              <Typography.Text>
                We comply with the requirements set out by the French National
                Commission for Data Protection and Liberties (“CNIL”) regarding
                data retention periods. As such, we do not exceed a retention
                period of thirteen (13) months from the date you agree to let us
                store cookies on your terminal.
              </Typography.Text>
              <Typography.Title level={1}>Consent</Typography.Title>
              <Typography.Text>
                You have the right to consent to the use of any cookies studying
                your behaviour (cookies linked to audience measurement
                operations). However, your consent is not required for cookies
                necessary for technical use. The collection of your consent
                takes the form of an information banner with an acceptance
                button and the option to click on the link in order to read the
                policy.
              </Typography.Text>
              <Typography.Title level={1}>Cookie settings</Typography.Title>
              <Typography.Text>
                If you would like to change your consent to accept or refuse
                cookies on this website, hover your cursor over the bottom
                left-hand corner of the browser viewport. A button will appear
                titled ‘Manage consent’. Click this button to raise the cookie
                preferences banner and change your cookie settings. You have the
                right to set the use of cookies on your terminal in order to
                accept or refuse all or part of the cookies that may be read or
                stored on your terminal, regardless of their nature and origin.
                To ensure that you have full control over the cookies stored in
                your terminal, you can check your browser settings. Most
                browsers allow you to choose or refuse all or part of the
                cookies, or even to select only those you wish to keep. To that
                end, each browser has their own specificities, and the settings
                remain relatively accessible via the « Help Menus » of each of
                them. For example: <br />
                Google Chrome:{" "}
                <a href="https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&hl=fr">
                  https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&hl=fr;
                </a>
                <br />
                Internet Explorer:{" "}
                <a href="https://support.microsoft.com/fr-fr/help/17442/windows-internet-explorer-delete-manage-cookies">
                  https://support.microsoft.com/fr-fr/help/17442/windows-internet-explorer-delete-manage-cookies;
                </a>
                <br />
                Mozilla Firefox:{" "}
                <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies-preferences">
                  https://support.mozilla.org/fr/kb/activer-desactiver-cookies-preferences;
                </a>
                <br />
                <a href="https://support.mozilla.org/fr/kb/effacer-les-cookies-pour-supprimer-les-information">
                  https://support.mozilla.org/fr/kb/effacer-les-cookies-pour-supprimer-les-information;
                </a>
                <br />
                Opera:{" "}
                <a href="http://help.opera.com/Windows/10.20/fr/cookies.html">
                  http://help.opera.com/Windows/10.20/fr/cookies.html.
                </a>
                <br />
                Vocabulift cannot guarantee the durability of these URLs, nor
                the quality of the information contained therein.
              </Typography.Text>
              <Typography.Title level={1}>Third party cookies</Typography.Title>
              <Typography.Text>
                Third party cookies may be stored by partners in order to
                identify your areas of interest through the products or services
                you are consulting on our website. We do not control cookies
                that are stored on your device by third parties.Therefore, we
                invite you to read their own cookie policies for more
                information. Either way, we reserve the right to audit these
                third parties to verify the correct application of the
                regulations applicable to third party cookies, but this right
                does not constitute an obligation or transfer of liability on
                our part.
              </Typography.Text>
              <Typography.Title level={1}>Updates</Typography.Title>
              <Typography.Text>
                In the event of regulatory changes or recommendations from the
                CNIL, we may modify this policy. You will be notified of any new
                policy before it takes effect.
              </Typography.Text>
              <Typography.Title level={1}>Contact us</Typography.Title>
              <Typography.Text>
                If you have any questions about this cookie policy, please do
                not hesitate to contact us via the contact form available at the
                following address:{" "}
                <a href="/contact">https://vocabulift.com/contact.</a>
              </Typography.Text>
            </Card>
          </Col>
          <Col span={2} />
        </Row>
      </Container>
    </Suspense>
  );
};

export default CookiePolicy;
