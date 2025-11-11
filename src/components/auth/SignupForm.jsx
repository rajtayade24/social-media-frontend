import React, { useEffect, useRef, useState } from "react";
import { apiFetch, BASE_URL } from "../../service/api";
import { Link } from "react-router-dom";
import { UserCircle2Icon } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function SignupForm(props) {
  const [identifier, setIdentifier] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [isPrimaryInfo, setPrimaryInfo] = useState(true)
  const [isSecondaryInfo, setSecondaryInfo] = useState(false)
  const [isTertiaryInfo, setTertiaryInfo] = useState(false)

  const [disableVerifyBtn, setDisableVerifyBtn] = useState(false);
  const [otp, setOtp] = useState("");

  const [selectedFile, setSelectedFile] = useState(null); // File object
  const [previewUrl, setPreviewUrl] = useState(null); // object URL for preview
  const fileInputRef = useRef(null);

  const { signup, userImageSrc, setUserImageSrc, setVerificationStatus, setVerificationSuccess, verificationStatus, verificationSuccess } = useAuthStore()

  const sendOtp = async (e) => {
    e.preventDefault()

    setDisableVerifyBtn(true);
    setVerificationStatus("Waiting...")
    setTimeout(() => setDisableVerifyBtn(false), 10000);

    try {
      const normalizedIdentifier = identifier.trim();
      const payloadIdentifier = /^\d{10}$/.test(normalizedIdentifier)
        ? '+91' + normalizedIdentifier
        : normalizedIdentifier;

      const res = await fetch(BASE_URL + "/api/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: payloadIdentifier, username }),
      });

      const data = await res.json();

      setVerificationSuccess(data.success || "false")
      setVerificationStatus(data.message || "Code sent.");
      setSecondaryInfo(true)
    }
    catch (err) {
      console.log(err.message);
      setVerificationStatus(err.message)
    };
  }

  const verifyOtp = async (e) => {
    e.preventDefault()

    setDisableVerifyBtn(true);

    if (!otp) {
      setVerificationStatus("Please enter the code.")
      return;
    }

    try {
      const data = await apiFetch("/api/otp/verify", {
        method: "POST",
        body: JSON.stringify({ identifier, otp }),
      });

      console.log("verify response", data);

      setVerificationStatus(data.message || (data.success === "true" ? "Verified." : "Invalid code."));
      if (data.success === true || data.success === "true") {
        setSecondaryInfo(false)
        setPrimaryInfo(false)
        setTertiaryInfo(true)
      }
    } catch (err) {
      console.error("verifyOtp error:", err);
      setVerificationStatus("Verification failed due to a server error.");
    }
  }

  // create/revoke object URL for preview whenever selectedFile changes
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      setUserImageSrc(null); // notify parent that image removed
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setUserImageSrc(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  // cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUserImageSrc(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("identifier", identifier);
    formData.append("userPassword", userPassword);
    formData.append("name", fullName);
    if (selectedFile) {
      formData.append("profilePhotoUrl", selectedFile);
    }

    for (let [k, v] of formData.entries()) { console.log("formData:", k, v); }

    const result = await signup(formData);
    console.log("signup result:", result);

    if (result.ok) {
      form.reset();
      props.navigate("/"); // logged in
    } else {
      const msg = result.data?.message || result.error || "Signup failed";
      alert(msg);
    }
  }

  return (
    <>
      <div className={`font-[Pacifico] text-[28px] ig-logo py-3 px-5 font-bold active:text-gray-500 text-center`}>ReelJolly</div>
      <p className="text-center text-gray-500 text-sm mb-4">
        Sign up to see photos and videos from your friends.
      </p>
      <form
        encType="multipart/form-data"
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (isTertiaryInfo) handleSubmit(e);
        }}
      >
        {isPrimaryInfo && (
          <div className={`primary-info flex flex-col gap-3`}>
            <div className="relative">
              <input
                type="text"
                name="identifier"
                id="identifier"
                className="peer w-full border rounded-md px-2 pt-4 pb-1.5 bg-gray-100 
                outline-none focus:border-blue-500 placeholder-transparent"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />

              <label
                htmlFor="identifier"
                className="absolute left-3 top-3 text-gray-500 text-base transition-all
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 
                  peer-placeholder-shown:text-sm 
                  peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500"
              >
                Mobile Number or email
              </label>

            </div>

            <div className="relative">
              <input
                type="text"
                name="username"
                id="username"
                className="peer w-full border rounded-md px-2 pt-4 pb-1.5 bg-gray-100 
                outline-none focus:border-blue-500 placeholder-transparent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label
                htmlFor="username"
                className="absolute left-3 top-3 text-gray-500 text-base transition-all 
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 
                  peer-placeholder-shown:text-sm 
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500"
              >
                username
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                name="name"
                id="name"
                className="peer w-full border rounded-md px-2 pt-4 pb-1.5 bg-gray-100 
                  outline-none focus:border-blue-500 placeholder-transparent"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <label
                htmlFor="name"
                className="absolute left-3 top-3 text-gray-500 text-base transition-all 
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 
                  peer-placeholder-shown:text-sm 
                  peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500"
              >
                Full name
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                name="userPassword"
                id="userPassword"
                className="peer w-full border rounded-md px-2 pt-4 pb-1.5 bg-gray-100 
                outline-none focus:border-blue-500 placeholder-transparent"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />

              <label
                htmlFor="userPassword"
                className="absolute left-3 top-3 text-gray-500 text-base transition-all 
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 
                  peer-placeholder-shown:text-sm 
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500"
              >
                password
              </label>
            </div>

            {isSecondaryInfo && (
              <div className={`secondary-info flex flex-col gap-3`}>
                <div>
                  <div className="flex justify-between">
                    <input
                      className="border rounded-sm px-3 py-2 text-sm"
                      maxLength={6}
                      value={otp || ""}
                      placeholder="Enter 6-digit code"
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        if (disableVerifyBtn) return;
                        setDisableVerifyBtn(true);

                        sendOtp(e)

                        setTimeout(() => {
                          setDisableVerifyBtn(false)
                        }, 10000);
                      }}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold mt-2 text-center cursor-pointer"
                    >Resend Otp</button>
                  </div>
                </div>
              </div>
            )}

            <p >{verificationStatus} </p>

            <button
              type="button"
              onClick={(e) => {
                if (!isSecondaryInfo) {
                  if (username && identifier && userPassword) sendOtp(e)
                  else setVerificationStatus("Please fill your data for sign in");
                }
                else
                  verifyOtp(e)
              }}
              className="bg-blue-500 text-white py-2 rounded-md font-semibold mt-2 text-center cursor-pointer"
            >
              {isSecondaryInfo ? "Verify" : "Sign Up"}
            </button>
          </div>
        )}

        {isTertiaryInfo && (
          <div className={`secondary-info flex flex-col gap-3`}>
            <div className="h-12 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 flex justify-center items-center rounded-full overflow-hidden flex-shrink-0 border">
                  {previewUrl || userImageSrc ?
                    <img
                      src={previewUrl || userImageSrc}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    : <UserCircle2Icon size={80} />
                  }
                </div>

                <div className="flex flex-col">
                  <input
                    type="file"
                    id="profile"
                    ref={fileInputRef}
                    className="hidden"
                    name="profilePhotoUrl"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="profile"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition cursor-pointer inline-block"
                  >
                    Select Profile
                  </label>

                  {selectedFile ? (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-gray-600">{selectedFile.name}</span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-sm px-2 py-1 rounded-md border border-red-400 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-500">No profile image selected</div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-md font-semibold mt-2 text-center cursor-pointer"
            >
              {selectedFile ? "Proceed" : "Skip"}
            </button>
          </div>
        )}
      </form >

      <div className="border border-gray-300 bg-white mt-4 p-4 text-center">
        <p>
          Have an account?{""}
          <Link
            to="/verify/login"
            className="text-blue-500 cursor-pointer"
            onClick={() => props.setLoginSection(true)} // toggle to login
          >
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}

