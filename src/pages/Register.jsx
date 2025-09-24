import "../assets/styles/authentication.css";
import Heaven from "../assets/media/heaven-white.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { message } from "antd";
import { useState } from "react";
import * as Yup from "yup";
import ButtonLoader from "../component/buttonloader";
import { AccountApiRequest } from "../service/api";
import { userStore } from "../service/store";
import { useNavigate, Link } from "react-router-dom";
import { TickCircle } from "iconsax-reactjs";

export default function Login() {
  const [Submitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [registered, setRegistered] = useState(false);

  const navigate = useNavigate();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Register Successful",
    });
  };
 
  const openGmailApp = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      if (/Android/i.test(navigator.userAgent)) {
        window.location.href = "https://mail.google.com/mail";
      } else {
        window.location.href = "googlegmail://";
        setTimeout(() => {
          window.location.href = "https://mail.google.com";
        }, 1000);
      }
    } else {
      window.open("https://mail.google.com", "_blank");
    }
  };

  return (
    <>
      <div className="auth_container">
        {!registered && (
          <div className="register">
            {contextHolder}

            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <img
                style={{ marginRight: 10 }}
                src={Heaven}
                alt="Logo"
                height={34}
              />
              <span className="h4 white">Agada</span>
            </p>
            <div className="main register-main">
              <div className="logo-create-div">
                <div className="header">
                  <h4 className="h5 text-align-center black">Sign up</h4>
                  <p className="regular-14 grey-one text-align-center">
                    Create an account to get started
                  </p>
                </div>

                <div className="signup-form">
                  <Formik
                    initialValues={{
                      password: "",
                      email: "",
                      mat_number: "",
                    }}
                    validationSchema={Yup.object({
                      password: Yup.string()
                        .min(8, "Password must be at least 8 characters")
                        .required("Password is required"),
                      email: Yup.string()
                        .required("Email is required")
                        .email("Please enter a valid email address"),
                      mat_number: Yup.string()
                        .matches(
                          /^[a-zA-Z]{3}\d{2}[a-zA-Z]{2}\d{3}$/,
                          "Please enter a valid matric number (e.g. sci21cs024)"
                        )
                        .required("Please add your Matric Number"),
                      name: Yup.string()
                        .matches(
                          /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
                          "Please enter a valid name"
                        )
                        .min(2, "Name must be at least 2 characters")
                        .max(50, "Name cannot exceed 50 characters")
                        .required("Name is required"),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        await AccountApiRequest.register(values);

                        success();
                        setRegistered(true);
                      } catch (err) {
                        if (err.status === 460) {
                          message.error("Email address taken.", 5);
                        }
                        if (err.status === 461) {
                          message.error(
                            "This matric number is already registered",
                            5
                          );
                        }
                        if (err.status === 500) {
                          message.error(
                            "Server error. Please try again later."
                          );
                        }
                        localStorage.removeItem("scalesToken");
                      } finally {
                        setSubmitting(false);
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    {({ isSubmitting, setFieldValue }) => (
                      <Form
                        className="form-block"
                        autoComplete="off"
                        spellCheck="false"
                      >
                        <div style={{ display: "none" }}>
                          <input type="password" name="hidden-password" />
                          <input type="username" name="hidden-username" />
                        </div>

                        <div className="input-block">
                          <label htmlFor="email">Email</label>
                          <Field
                            className="input-field"
                            id="email"
                            name="email"
                            type="text"
                            placeholder="e.g, agada@gmail.com"
                            autoComplete="email"
                            autoCorrect="off"
                            autoCapitalize="off"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-block">
                          <label htmlFor="name">Name</label>
                          <Field
                            className="input-field"
                            id="name"
                            name="name"
                            placeholder="Agada Agada"
                            autoComplete="new-name"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-block">
                          <label htmlFor="mat_number">Matrc Number</label>
                          <Field
                            className="input-field"
                            id="mat_number"
                            name="mat_number"
                            placeholder="sci21cs024"
                            autoComplete="new-mat_number"
                          />
                          <ErrorMessage
                            name="mat_number"
                            component="div"
                            className="error-message"
                          />
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

                        <button
                          type="submit"
                          className="primary-button"
                          disabled={isSubmitting}
                          style={{
                            marginTop: "1rem",
                          }}
                        >
                          {isSubmitting ? <ButtonLoader /> : "Sign up"}
                        </button>

                        <div
                          className="medium-14 dark text-align-center"
                          style={{ marginTop: ".3rem", marginBottom: "1rem" }}
                        >
                          Already have an account?{" "}
                          <Link
                            style={{
                              color: "#000",
                              fontWeight: "500",
                            }}
                            to="/dashboard"
                          >
                            Sign in
                          </Link>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        )}

        {registered && (
          <div className="verification-sent">
            <div className="verification-sent-component">
              <TickCircle size="64" color="#02B52F" variant="Bulk" />
              <div className="verify-text">
                <h4 className="h5 black"> Verification Email Sent</h4>
                <p className="regular-14 dark">
                  We sent a verification to your email. Verify your account to
                  continue
                </p>
              </div>
            </div>
            <div className="btn-verify">
              <button
                className="primary-button open-email-btn"
                onClick={() => {
                  openGmailApp();
                }}
              >
                Open Email App
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
