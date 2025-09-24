import { useState, useEffect } from "react";
import "../assets/styles/authentication.css";
import Logo from "../assets/media/heaven-white.png";
import { motion } from "framer-motion";
import { TickCircle } from "iconsax-reactjs";
import { CloseCircle } from "iconsax-reactjs";
import LoadingSpinner from "../component/loading";
import { AccountApiRequest } from "../service/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { message } from "antd";

export default function VerifyEmail() {
  const [isVerifying, setisVerifying] = useState(true);
  const [verified, setisVerified] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(true);
  const [retryingVerification, setRetryingVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [requestNewToken, setRequestingNewToken] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const navigate = useNavigate();

  const tokenSuccess = () => {
    messageApi.open({
      type: "success",
      content: "Reset link has been sent",
    });
  };

  const tokenFailure = () => {
    messageApi.open({
      type: "error",
      content: "Failed to send link",
    });
  };

  useEffect(() => {
    if (isSubmitting && !verified) {
      const emailVerify = async () => {
        setisSubmitting(true);
        try {
          setisVerifying(true);
          const response = await AccountApiRequest.verifyEmail({ token });
          setTimeout(() => {
            setisVerified(true);
          }, 1000);
        } catch (error) {
          setTimeout(() => {
            setisVerified(false);
          }, 1000);
        } finally {
          setTimeout(() => {
            setisVerifying(false);
          }, 1000);
        }

        setisSubmitting(false);
      };
      emailVerify();
    }
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            return "";
          }

          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRunning, timeLeft, isSubmitting, isVerifying, verified]);

  const retryVerify = async () => {
    try {
      setisVerifying(true);
      const res = await AccountApiRequest.verifyEmail({ token });
      message.success("Verification Successful");
      setisVerified(true);
    } catch (err) {
      console.log(err);
      message.error("Failed Verication");
      setisVerified(false);
    } finally {
      setisVerifying(false);
    }
  };

  const restartTimer = async () => {
    setTimeLeft(60);
    setIsRunning(true);

    try {
      setRequestingNewToken(true);
      const response = await AccountApiRequest.requestVerificationToken({
        email,
      });
      console.log(response);
      tokenSuccess();
    } catch (err) {
      console.log(err);
      tokenFailure();
    } finally {
      setRequestingNewToken(false);
    }
  };

  return (
    <div className="screen-layout">
      <div className="register mt-50">
        {contextHolder}
        <img src={Logo} alt="Logo" height={34} className="logo hidden" />
        {isVerifying && !verified && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="verification-sent"
          >
            <div className="verification-sent-component">
              <LoadingSpinner />
              <div className="verify-text">
                <h4 className="h4 black">Verifying..</h4>
                <p className="regular-14 dark">In a moment</p>
              </div>
            </div>
          </motion.div>
        )}

        {!isVerifying && verified && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="verification-sent"
          >
            <div className="verification-sent-component">
              <TickCircle size="64" color="#34c759" variant="Bulk" />
              <div className="verify-text">
                <h4 className="h4 black">Verification Successful</h4>
                <p className="regular-14 dark">
                  Congrats, You can now login to your account
                </p>
              </div>
            </div>
            <div className="btn-verify">
              <button
                className="primary-button open-email-btn"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Proceed to Login
              </button>
            </div>
          </motion.div>
        )}

        {!isVerifying && !verified && (
          <div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="verification-sent"
          >
            <div className="verification-sent-component">
              <CloseCircle size="64" color="#FF3B30" variant="Bulk" />
              <div className="verify-text">
                <h4 className="h4 black">Verification Failed</h4>
                <p className="regular-14 dark">
                  It’s us, not you. Kindly try again
                </p>
              </div>
            </div>
            <div className="btn-verify">
              <button
                className="primary-button open-email-btn"
                onClick={retryVerify}
              >
                Try again
              </button>
              {isRunning ? (
                <button
                  disabled
                  className="semibold-15 tertiary-btn disable-button"
                  style={{
                    color: "#F65200",
                  }}
                  onClick={restartTimer}
                >
                  Resend Link ({timeLeft})
                </button>
              ) : (
                <button
                  className="semibold-15 tertiary-btn pointer"
                  onClick={restartTimer}
                >
                  Resend Link
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
