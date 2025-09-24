import "../assets/styles/authentication.css";
import Heaven from "../assets/media/heaven-white.png";

import { Formik, Field, Form, ErrorMessage } from "formik";
import { message, Dropdown } from "antd";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import ButtonLoader from "../component/buttonloader";
import { AccountApiRequest } from "../service/api";
import { userStore } from "../service/store";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [Submitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [emailVerified, setEmailVerified] = useState(true);

  const navigate = useNavigate();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Login Successful",
    });
  };

  const User = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);

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
      {emailVerified && (
        <div className="auth_container">
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
              <span className="h4 white">Agada Samuel</span>
            </p>
            <div className="main register-main">
              {/* logo and text */}
              <div className="logo-create-div">
                <div className="header">
                  <h4 className="h5 text-align-center black">Sign In</h4>
                  <p className="regular-14 grey-one text-align-center">
                    Login to your account
                  </p>
                </div>

                {/* signin form */}
                <div className="signup-form">
                  <Formik
                    initialValues={{
                      password: "",
                      mat_number: "",
                    }}
                    validationSchema={Yup.object({
                      password: Yup.string()
                        .min(8, "Password must be at least 8 characters")
                        .required("Password is required"),
                      mat_number: Yup.string()
                        .matches(
                          /^[a-zA-Z]{3}\d{2}[a-zA-Z]{2}\d{3}$/,
                          "Please enter a valid matric number (e.g. sci21cs024)"
                        )
                        .required("Please add your Matric Number"),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        const res = await AccountApiRequest.login(values);
                        localStorage.setItem("scalesToken", String(res.token));
                        const currentUser = await AccountApiRequest.currentUser(
                          res.id
                        );
                        setUser(currentUser);
                        success();
                        setTimeout(() => {
                          navigate("/dashboard");
                        }, 2000);
                      } catch (err) {
                        if (err.status === 400) {
                          message.error(
                            "Email not verified... Check mail for verification link"
                          );
                        }
                        if (err.status === 404) {
                          message.error("Invalid credentials");
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
                        {/* Hidden field to trick browser autofill */}
                        <div style={{ display: "none" }}>
                          <input type="password" name="hidden-password" />
                          <input type="username" name="hidden-username" />
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
                          {isSubmitting ? <ButtonLoader /> : "Sign in"}
                        </button>

                        <p
                          className="medium-14 dark text-align-center"
                          style={{ marginTop: ".3rem" }}
                        >
                          <Link
                            style={{
                              fontWeight: "500",
                            }}
                            to="/forgot-password"
                          >
                            Reset password
                          </Link>
                        </p>
                        <div
                          className="medium-14 dark text-align-center"
                          style={{ marginTop: ".3rem", marginBottom: "1rem" }}
                        >
                          No account?{" "}
                          <Link
                            style={{
                              color: "#000",
                              fontWeight: "500",
                            }}
                            to="/register"
                          >
                            Create an account
                          </Link>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
              {/* <footer className="footer">
                <p className="regular-14 grey-one">
                  By using Voxa, you agree to our{" "}
                  <a
                    href="https://www.notion.so/Terms-of-Service-1e2f975cf41a805bbec4c42147b9edc7"
                    className="links"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.notion.so/Privacy-Policy-1e2f975cf41a80f8bab6c9adb8e61076"
                    className="links"
                  >
                    Privacy Policy
                  </a>
                </p>
              </footer> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
