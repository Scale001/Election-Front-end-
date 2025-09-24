import { useState } from "react";
import Welcome from "../component/Welcome";
import "../assets/styles/authentication.css";
import Logo from "../assets/media/logo.png";
import { KeySquare } from "iconsax-reactjs";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ButtonLoader from "../component/buttonloader";
import { Modal, message } from "antd";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AccountApiRequest } from "../service/api";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const [messageAPI, contextHolder] = message.useMessage();

  const token = searchParams.get("token");

  return (
    <div className="screen-layout">
      <Welcome />
      <div className="register">
        <img src={Logo} alt="Logo" height={34} className="logo hidden" />
        <div className="verification-sent">
          <div className="verification-sent-component">
            <KeySquare size="64" color="#F67B00" variant="Bulk" />
            <div className="verify-text">
              <h4 className="h4 black">Reset Password</h4>
              <p className="regular-14 dark">
                Enter your registered email to get a reset link
              </p>
            </div>
          </div>
          <div className="signup-form">
            <Formik
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              validationSchema={Yup.object({
                password: Yup.string()
                  .matches(
                    /[a-zA-Z]/,
                    "Password must contain at least one letter"
                  )
                  .matches(/[0-9]/, "Password must contain at least one number")
                  .min(8, "Password must be at least 8 characters")
                  .required("Password is required"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("password"), null], "Passwords must match")
                  .required("Confirm password is required"),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                const newCode = {
                  token: token,
                  password: values.confirmPassword,
                };

                try {
                  await AccountApiRequest.resetPassword(newCode);
                  setTimeout(() => {
                    setSubmitting(false);
                    setShowModal(true);
                  }, 1000);
                } catch (err) {
                  if (err.status == 404 || 406) {
                    messageAPI.error("Token has been used or is expired!");
                  } else {
                    messageAPI.error("Reset Failed, Try again!");
                  }
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form
                  className="form-block"
                  autoComplete="off"
                  spellCheck="false"
                >
                  {/* Hidden field to trick browser autofill */}
                  <div style={{ display: "none" }}>
                    <input type="email" name="hidden-email" />
                  </div>

                  <div className="input-block">
                    <label htmlFor="password">Password</label>
                    <Field
                      className="input-field"
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="input-block">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <Field
                      className="input-field"
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Password"
                      autoComplete="confirmPassword"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={isSubmitting}
                    style={{
                      marginTop: "1rem",
                    }}
                  >
                    {isSubmitting ? <ButtonLoader /> : "Reset Password"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <Modal
          open={showModal}
          className="modal-container"
          closable={false}
          centered
          style={{
            padding: "0 1rem",
          }}
          styles={{
            mask: {
              backdropFilter: "blur(8px)",
            },
          }}
          footer={null}
        >
          <div
            className="modal"
            style={{
              display: "flex",
              width: "100%",
              margin: "0 auto",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <DotLottieReact
              src="https://lottie.host/2c22f280-9f47-415d-a364-eae39d71b26f/2OAZb2gmth.lottie"
              autoplay
              style={{
                width: "100px",
              }}
            />
            <div
              style={{
                width: "90%",
              }}
              className="modal-text"
            >
              <h5 className="h5">Reset Successful</h5>
              <p className="regular-14 grey-one">
                Password has been changed. Please login.
              </p>
            </div>
            <button
              style={{
                marginTop: "0.5rem",
              }}
              onClick={() => {
                window.location.href = "/login";
              }}
              className="primary-button-small open-email-btn"
            >
              Proceed to Login
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
