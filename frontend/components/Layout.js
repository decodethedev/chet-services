import { motion } from "framer-motion";

const Layout = ({ children }) => (
  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 100, opacity: 0 }}
    transition={{
      type: "spring",
      stiffness: 100,
      damping: 20,
    }}
  >
    {children}
  </motion.div>
);
export default Layout;
