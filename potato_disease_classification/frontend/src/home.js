import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Paper,
  CardActionArea,
  CardMedia,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { common } from "@material-ui/core/colors";
import Clear from "@material-ui/icons/Clear";
import cblogo from "./cblogo.PNG";
import image from "./bg.png";
import axios from "axios";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    "&:hover": {
      backgroundColor: "#ffffff7a",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
  },
  root: { maxWidth: 345, flexGrow: 1 },
  media: { height: 400 },
  gridContainer: { justifyContent: "center", padding: "4em 1em 0 1em" },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: "93vh",
    marginTop: "8px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 500,
    backgroundColor: "transparent",
    boxShadow: "0px 9px 70px 0px rgb(0 0 0 / 30%) !important",
    borderRadius: "15px",
  },
  imageCardEmpty: { height: "auto" },
  tableContainer: { backgroundColor: "transparent !important", boxShadow: "none !important" },
  table: { backgroundColor: "transparent !important" },
  tableHead: { backgroundColor: "transparent !important" },
  tableRow: { backgroundColor: "transparent !important" },
  tableCell: {
    fontSize: "22px",
    backgroundColor: "transparent !important",
    borderColor: "transparent !important",
    color: "#000000a6 !important",
    fontWeight: "bolder",
    padding: "1px 24px 1px 16px",
  },
  tableCell1: {
    fontSize: "14px",
    backgroundColor: "transparent !important",
    borderColor: "transparent !important",
    color: "#000000a6 !important",
    fontWeight: "bolder",
    padding: "1px 24px 1px 16px",
  },
  tableBody: { backgroundColor: "transparent !important" },
  buttonGrid: { maxWidth: "416px", width: "100%" },
  detail: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  appbar: { background: "#be6a77", boxShadow: "none", color: "white" },
  loader: { color: "#be6a77 !important" },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [imageSelected, setImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let confidence = 0;

  const API_URL = "http://localhost:8000/predict";

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // clean up URL
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) return;

    let isMounted = true; // ✅ flag to prevent state updates on unmount
    setIsLoading(true);

    const upload = async () => {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await axios.post(API_URL, formData);

        if (isMounted && res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        if (isMounted) console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    upload();

    return () => {
      isMounted = false; // cleanup on unmount
    };
  }, [preview, selectedFile, API_URL]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImageSelected(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImageSelected(true);
  };

  const clearData = () => {
    setData(null);
    setImageSelected(false);
    setSelectedFile(null);
    setPreview(null);
  };

  if (data) confidence = (parseFloat(data.confidence) * 100).toFixed(2);

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            CodeBasics: Potato Disease Classification
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo} />
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} className={classes.mainContainer} disableGutters>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!imageSelected ? classes.imageCardEmpty : ""}`}>
              {imageSelected && (
                <CardActionArea>
                  <CardMedia className={classes.media} image={preview} component="img" title="Potato Leaf" />
                </CardActionArea>
              )}

              {!imageSelected && (
                <CardContent>
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    dropzoneText="Drag and drop an image of a potato plant leaf to process"
                    onChange={onSelectFile}
                  />
                </CardContent>
              )}

              {data && (
                <CardContent className={classes.detail}>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} size="small">
                      <TableHead className={classes.tableHead}>
                        <TableRow className={classes.tableRow}>
                          <TableCell className={classes.tableCell1}>Label:</TableCell>
                          <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className={classes.tableBody}>
                        <TableRow className={classes.tableRow}>
                          <TableCell className={classes.tableCell}>{data.class}</TableCell>
                          <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}

              {isLoading && (
                <CardContent className={classes.detail}>
                  <CircularProgress color="secondary" className={classes.loader} />
                  <Typography variant="h6" noWrap>Processing</Typography>
                </CardContent>
              )}
            </Card>
          </Grid>

          {data && (
            <Grid item className={classes.buttonGrid}>
              <ColorButton
                variant="contained"
                className={classes.clearButton}
                color="primary"
                component="span"
                size="large"
                onClick={clearData}
                startIcon={<Clear fontSize="large" />}
              >
                Clear
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
