import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        // console.log("??????????", data);
        // console.log("**********", errors);
        if (data && data.message) {
          // setErrors(data.message);
          setErrors({ credential: data.message });
        }
      });
  };

  const demoLogin = async () => {
    return dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    ).then(closeModal);
  };

  return (
    <>
      <div className="LogIn">
        <div className="login-modal-div">
          <h1>Log In</h1>
        </div>
        <div className="div-LogIn-form">
          {errors.message && <p className="err">{errors.message}</p>}

          <form onSubmit={handleSubmit}>
            <div>
              <input
                className="input"
                type="text"
                placeholder="Username or Email"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>
            {errors.credential && <p className="err">{errors.credential}</p>}
            <div className="div-button-login">
              <button
                className="login-button"
                type="submit"
                disabled={credential.length < 4 || password.length < 6}
              >
                Log In
              </button>
            </div>
          </form>

          <div>
            <button className="div-demoUser" onClick={demoLogin}>
              Demo User
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginFormModal;
