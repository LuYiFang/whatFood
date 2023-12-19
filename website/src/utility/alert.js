import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export class Alert {
  static swal = withReactContent(Swal);

  static async error(msg = "", title = "") {
    this.swal.fire({
      title: title ? title : "Error!",
      text: msg,
      icon: "error",
      confirmButtonText: "OK",
    });
  }

  static async warning(msg = "", title = "") {
    this.swal.fire({
      title: title ? title : "Warning!",
      text: msg,
      icon: "warning",
      confirmButtonText: "OK",
    });
  }

  static async success(msg = "", title = "") {
    this.swal.fire({
      title: title ? title : "Success!",
      text: msg,
      icon: "success",
      confirmButtonText: "OK",
    });
  }
}
