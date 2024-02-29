import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  offersContainer: {
    width: "100%",
    display: "flex",
    marginTop: 24,
    position: "relative",
    padding: "0px 11rem",
  },
  offersRow: {
    display: "flex",
    gap: "18px",
    overflow: "auto",
    paddingBottom: "10px",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    //  overflow: "hidden",
    transition: "transform 0.5s ease",
    scrollBehavior: "smooth",
  },
  offerCard: {
    width: "max-content",
    height: "max-content",
    border: "1.5px solid #e8e8e8",
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    padding: "20px 30px",
    //  marginRight: 20,
  },
  left: {
    width: "max-content",
    minWidth: 150,
  },
  right: {
    width: 50,
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  offerTitle: {
    fontSize: 14,
    margin: 0,
  },
  offerText: {
    fontSize: 24,
    fontWeight: "600",
    margin: 0,
    textTransform: "capitalize",
    marginBottom: 10,
  },
  brandImage: {
    height: 30,
  },
  leftIcon: {
    position: "absolute",
    left: 100,
    top: 50,
  },
  rightIcon: {
    position: "absolute",
    right: 100,
    top: 50,
  },
});

export default useStyles;