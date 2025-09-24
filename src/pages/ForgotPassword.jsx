import "../assets/styles/authentication.css";
import Heaven from "../assets/media/heaven-white.png";

import { Formik, Field, Form, ErrorMessage } from "formik";
import { message } from "antd";
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
              <img
                style={{ marginRight: 10 }}
                src={Heaven}
                alt="Logo"
                height={34}
              />
              <span className="h4 white">Heavne</span>
            </p>
            <div className="main register-main">
              {/* logo and text */}
              <div className="logo-create-div">
                <div className="header">
                  <h4 className="h5 text-align-center black">Reset Password</h4>
                  <p className="regular-14 grey-one text-align-center">
                    Enter your regsitered email to get reset link
                  </p>
                </div>

                {/* signin form */}
                <div className="signup-form">
                  <Formik
                    initialValues={{
                      password: "",
                      email: "",
                      role: "",
                    }}
                    validationSchema={Yup.object({
                      email: Yup.string()
                        .required("Email is required")
                        .email("Please enter a valid email address"),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        await AccountApiRequest.requestPasswordResetMain(
                          values
                        );
                      } catch (err) {
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
                        <div className="input-block">
                          <label htmlFor="email">Email Address</label>
                          <Field
                            className="input-field"
                            id="email"
                            name="email"
                            type="text"
                            placeholder="e.g, hendrix@gmail.com"
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

                        <button
                          type="submit"
                          className="primary-button"
                          disabled={isSubmitting}
                          style={{
                            marginTop: "1rem",
                          }}
                        >
                          {isSubmitting ? <ButtonLoader /> : " Send Reset Link"}
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
                            to="/login"
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
        </div>
      )}
    </>
  );
}
