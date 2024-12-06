import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    doc,
    setDoc,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    getDocs,
    GoogleAuthProvider,
    
    
  } from "./firebase.js";
  
  // Helper function for error handling with SweetAlert
  const showError = (error) => {
    console.error(error);
    Swal.fire("Error", error.message, "error");
  };
  
  // Sign Up Function
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const username = document.getElementById("UserName").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          createdAt: serverTimestamp(),
        });
  
        Swal.fire("Success", "Account created successfully!", "success");
        window.location.href = "login.html"; // Redirect to login page
      } catch (error) {
        showError(error);
      }
    });
  }
  
  // Login Function
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      try {
        await signInWithEmailAndPassword(auth, email, password);
        Swal.fire("Success", "Logged in successfully!", "success");
        window.location.href = "index.html"; // Redirect to homepage
      } catch (error) {
        showError(error);
      }
    });
    
  }
  
  // Google Login Function
  

  // Initialize Google Provider
  const googleLoginBtn = document.getElementById("google-login-btn");
  if (googleLoginBtn) {
      googleLoginBtn.addEventListener("click", async () => {
          const provider = new GoogleAuthProvider();
          try {
              const result = await signInWithPopup(auth, provider);
              const user = result.user;
  
              // Save Google user data to Firestore
              await setDoc(doc(db, "users", user.uid), {
                  username: user.displayName,
                  email: user.email,
                  createdAt: serverTimestamp(),
              });
  
              Swal.fire("Success", "Logged in with Google!", "success");
              window.location.href = "index.html"; // Redirect to homepage
          } catch (error) {
              Swal.fire("Error", error.message, "error");
          }
      });
  }
  
  // Logout Function
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        Swal.fire("Success", "Logged out successfully!", "success");
        window.location.href = "login.html"; // Redirect to login page
      } catch (error) {
        showError(error);
      }
    });
  }
  
  // Create Post Function
  const createPostBtn = document.querySelector(".create-post-btn");
  if (createPostBtn) {
    createPostBtn.addEventListener("click", async () => {
      const { value: formValues } = await Swal.fire({
        title: "Create Post",
        html: `
            <input id="swal-title" class="swal2-input" placeholder="Post Title">
            <textarea id="swal-description" class="swal2-textarea" placeholder="Post Description"></textarea>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Add Post",
        preConfirm: () => {
          const title = document.getElementById("swal-title").value;
          const description = document.getElementById("swal-description").value;
          if (!title || !description) {
            Swal.showValidationMessage("Both fields are required!");
            return false;
          }
          return { title, description };
        },
      });
  
      if (formValues) {
        try {
          const user = auth.currentUser;
          if (user) {
            const postsRef = collection(db, "posts");
            await addDoc(postsRef, {
              userId: user.uid,
              username: user.displayName || "Anonymous",
              title: formValues.title,
              description: formValues.description,
              timestamp: serverTimestamp(),
            });
            Swal.fire("Post Added!", "Your post has been successfully added.", "success");
            displayPosts(); // Refresh posts
          }
        } catch (error) {
          showError(error);
        }
      }
    });
  }
  
  // Display Posts on Dashboard
  async function displayPosts() {
    const postsContainer = document.getElementById("postContent");
  
    if (!postsContainer) {
      console.error("The posts container was not found in the DOM.");
      return;
    }
  
    postsContainer.innerHTML = ""; // Clear existing posts
  
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        const postId = doc.id;
  
        const postCard = `
            <div class="card mb-3" data-id="${postId}">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                    <p class="text-muted small">${post.timestamp ? new Date(post.timestamp.toMillis()).toLocaleString() : "No timestamp"}</p>
                    <p class="font-weight-bold">${post.username}</p>
                    <button class="btn btn-warning edit-post-btn" data-id="${postId}">Edit</button>
                    <button class="btn btn-danger delete-post-btn" data-id="${postId}">Delete</button>
                </div>
            </div>
        `;
        postsContainer.innerHTML += postCard;
      });
    } catch (error) {
      showError(error);
    }
  }
  