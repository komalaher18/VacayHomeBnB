import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          // console.log("*************", data);
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="form">
      <div className="header">
        <h1>Sign Up</h1>
      </div>

      <form className="form-signup" onSubmit={handleSubmit}>
        <div>
          {/* <label>
            First Name */}
          <input
            className="input"
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {/* </label> */}
          {errors.firstName && (
            <p className="signup-error">{errors.firstName}</p>
          )}
        </div>
        <div>
          {/* <label>
            Last Name */}
          <input
            className="input"
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {/* </label> */}
          {errors.lastName && <p className="signup-error">{errors.lastName}</p>}
        </div>
        <div>
          {/* <label>
            Email */}
          <input
            className="input"
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* </label> */}
          {errors.email && <p className="signup-error">{errors.email}</p>}
        </div>
        <div>
          {/* <label>
            Username */}
          <input
            className="input"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {/* </label> */}
          {errors.username && <p className="signup-error">{errors.username}</p>}
        </div>
        <div>
          {/* <label>
            Password */}
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* </label> */}
          {errors.password && <p className="signup-error">{errors.password}</p>}
        </div>
        <div>
          {/* <label>
            Confirm Password */}
          <input
            className="input"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {/* </label> */}
          {errors.confirmPassword && (
            <p className="signup-error">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="div-button">
          <button
            className="button-signup"
            type="submit"
            disabled={
              !firstName ||
              !lastName ||
              !email ||
              !username ||
              username.length < 4 ||
              !password ||
              password.length < 6 ||
              !confirmPassword ||
              confirmPassword.length < 6
            }
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
