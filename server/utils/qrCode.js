import qrCode from "qrcode";

const generateQR = async (currentUrl, req, res, next) => {
  try {
    const qrCodeUrl = await qrCode.toDataURL(`${currentUrl}`);
    return qrCodeUrl;
  } catch (error) {
    const err = new Error("Internal Server Error!");
    res.status(500);
    next(err);
  }
};

export default generateQR;
