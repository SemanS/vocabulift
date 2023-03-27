/* const useUserData = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Adjust the waiting time as needed
      const loggedInUser = { isLoggedIn: true }; // Replace with actual user data
      setUser(loggedInUser);
    };

    fetchUserData();
  }, []);

  return user;
}; */
