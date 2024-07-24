const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const invoices = require("./invoice.json");
const internal = require("stream");

const archiveInvoicesTask = () => {
  console.log("Running archive invoice task: ", new Date());
  try {
    // Fetch completed invoices
    const completedInvoices = invoices.filter((item) => {
      return item.status === "Abort";
    });

    // Remove completed invoice from json
    if (completedInvoices.length > 0) {
      completedInvoices.forEach((item) => {
        invoices.splice(
          invoices.findIndex((e) => {
            e.status === item.status;
          }),
          1
        );
      });

      fs.writeFileSync(
        path.join(__dirname, "./", "invoice.json"),
        JSON.stringify(invoices),
        "utf-8"
      );

      console.log("Completed Invoice are: ", completedInvoices);
      fs.writeFileSync(
        path.join(__dirname, "./", "archive.json"),
        JSON.stringify(completedInvoices),
        "utf-8"
      );
    }
  } catch (err) {
    console.log("err : ", err);
  }
  console.log("Task 2 ended");
};

cron.schedule("*/30 * * * * * ", archiveInvoicesTask);
