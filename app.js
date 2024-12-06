import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, signOut, db, collection, addDoc, onSnapshot, serverTimestamp, orderBy, query, doc, getDocs } from "./firebase.js";

// Sign Up
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    alert("Email verification sent!");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});

// Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      alert("Please verify your email first.");
      window.location.href = "index.html";
      return;
    }

  } catch (error) {
    alert(error.message);
  }
});

// Forgot Password
document.getElementById("forgot-password").addEventListener("click", async () => {
  const email = prompt("Enter your email:");
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent!");
  } catch (error) {
    alert(error.message);
  }
});

// Google Login
document.getElementById("google-login").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const docRef = addDoc(db, "users", user.uid);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.getElementById("user-info").innerHTML = `
    <p>Email: ${userData.email}</p>
    <p>Name: ${userData.displayName || "N/A"}</p>
  `;
    } else {
      console.error("No user data found!");
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
});

const logoutButton = document.getElementById("logout");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

// Blog form
const blogForm = document.getElementById("blogForm");
const blogSection = document.querySelector(".blog-section");

blogForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("blogTitle").value;
  const author = document.getElementById("blogAuthor").value;
  const content = document.getElementById("blogContent").value;

  console.log("Form data:", { title, author, content });

  try {
   const docRef = await addDoc(collection(db, "blogs"), {
      title,
      author,
      content,
      timestamp: serverTimestamp(),
    });

    alert("Blog posted successfully!", docRef.id);
    blogForm.reset();
    loadBlogs();
  } catch (error) {
    console.error("Error posting blog: ", error);
    alert("Failed to post blog.");
  }
});

const loadBlogs = () => {
  const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    console.log("Number of blogs fetched:", querySnapshot.size);
    blogSection.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const blog = doc.data();
      console.log("Blog data:", blog);

      const blogCard = `
        <div class="card mb-4">
          <div class="card-body">
            <h4 class="card-title">${blog.title}</h4>
            <h6 class="card-subtitle text-muted">By ${blog.author}</h6>
            <p class="card-text">${blog.content.substring(0, 150)}...</p>
            <small class="text-muted">${new Date(blog.timestamp.toDate()).toLocaleString()}</small>
          </div>
        </div>
      `;
      blogSection.innerHTML += blogCard;
    });
  }, (error) => {
    console.error("Error fetching blogs:", error);
    blogSection.innerHTML = "<p class='text-danger'>Failed to load blogs.</p>";
  });
};
document.addEventListener("DOMContentLoaded", loadBlogs);

// Searchbar functionality
const searchBar = document.querySelector(".search-bar");

searchBar.addEventListener("input", async () => {
  const searchTerm = searchBar.value.toLowerCase();

  try {
    const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    blogSection.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const blog = doc.data();
      const title = blog.title.toLowerCase();
      const content = blog.content.toLowerCase();

      if (title.includes(searchTerm) || content.includes(searchTerm)) {
        const blogCard = `
          <div class="card mb-4">
            <div class="card-body">
              <h4 class="card-title">${blog.title}</h4>
              <h6 class="card-subtitle text-muted">By ${blog.author}</h6>
              <p class="card-text">${blog.content.substring(0, 150)}...</p>
              <small class="text-muted">${new Date(blog.timestamp.toDate()).toLocaleString()}</small>
            </div>
          </div>
        `;

        blogSection.innerHTML += blogCard;
      }
    });
  } catch (error) {
    console.error("Error searching blogs: ", error);
    blogSection.innerHTML = "<p class='text-danger'>Failed to search blogs.</p>";
  }
});