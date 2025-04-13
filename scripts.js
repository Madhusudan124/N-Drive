var LOGGED_IN = false;
var USERNAME = false;
var FOLDER_ID = 0;
var DRIVE_OCCUPIED = 0;
var DRIVE_TOTAL = 0;

var share = {
  add: function (email) {
    if (email == "") {
      alert("Please type an email address first");
      document.querySelector(".js-access-email-input").focus();
      return;
    }

    let reg = new RegExp();
    reg = /^[a-zA-Z0-9\-\_\.]+\@[a-zA-Z0-9\-\_]+\.[a-zA-Z0-9\-\_\.]+$/g;
    if (!email.match(reg)) {
      alert("Please type a valid email address");
      document.querySelector(".js-access-email-input").focus();
      return;
    }

    let holder = document.querySelector(".js-access-email-holder");
    let div = document.createElement("div");
    div.setAttribute("class", "access-email");
    div.innerHTML = `
				<div class="email">${email}</div>
				<div class="close" onclick="share.remove(event)">X</div>
				<input type="hidden" value="${email}">
			`;
    holder.insertBefore(div, holder.children[0]);
    document.querySelector(".js-access-email-input").value = "";
    document.querySelector(".js-access-email-input").focus();
  },

  remove: function (e) {
    if (!confirm("Are you sure you want to remove access for this email?!")) {
      return;
    }
    e.currentTarget.parentNode.remove();
  },

  refresh: function (obj) {
    document.querySelector(".js-access-email-holder").innerHTML = "";
    let rows = JSON.parse(obj);
    for (var i = 0; i < rows.length; i++) {
      share.add(rows[i].email);
    }
  },
};

var mode = {
  current: "MY DRIVE",

  set: function (m) {
    mode.current = m;
    document.querySelector(".js-mode-title").innerHTML = mode.current;
    let selected = document.querySelector(".class_16");
    selected.classList.remove("class_16");
    selected.classList.add("class_18");

    let new_selected = document.getElementById(m);
    new_selected.classList.remove("class_18");
    new_selected.classList.add("class_16");

    table.refresh(mode.current);
  },
};

function openStorage() {
  // Send an AJAX request to the PHP script
}

// Add the event listener to the element
document.querySelector(".class_13").addEventListener("click", openStorage);

const submenu = {
  show: function (e) {
    e.preventDefault();

    table.select(e, "rightclick");

    let menu = document.getElementById("submenu");
    menu.style.left = e.clientX + "px";
    menu.style.top = e.clientY + window.scrollY + "px";

    //hide items not needed
    document.querySelector("#submenu .js-favorites-text").innerHTML =
      "Add to favorites";
    document
      .querySelector("#submenu .js-download-button")
      .classList.add("hide");
    document
      .querySelector("#submenu .js-favorites-button")
      .classList.add("hide");
    document.querySelector("#submenu .js-restore-button").classList.add("hide");
    document.querySelector("#submenu .js-preview-button").classList.add("hide");

    let id = table.selected.getAttribute("id").replace("tr_", "");
    if (table.ROWS[id].favorite == 1) {
      document.querySelector("#submenu .js-favorites-text").innerHTML =
        "Remove from favorites";
    }

    if (table.ROWS[id].file_type != "folder") {
      document
        .querySelector("#submenu .js-download-button")
        .classList.remove("hide");
      document
        .querySelector("#submenu .js-favorites-button")
        .classList.remove("hide");
      document
        .querySelector("#submenu .js-preview-button")
        .classList.remove("hide");
    }

    if (mode.current == "TRASH") {
      document
        .querySelector("#submenu .js-restore-button")
        .classList.remove("hide");
    }

    menu.classList.remove("hide");
  },

  hide: function () {
    let menu = document.getElementById("submenu");
    menu.classList.add("hide");
  },
};
//rename
let selectedId = 1; // Example selected ID, replace with the actual method to get the selected ID
let selectedName = "example.txt"; // Example selected name, replace with the actual method to get the selected name

function openRenamePrompt() {
  document.getElementById("renamePrompt").style.display = "block";
  document.getElementById("newName").value = selectedName;
}

function closeRenamePrompt() {
  document.getElementById("renamePrompt").style.display = "none";
}

function submitRename() {
  const newName = document.getElementById("newName").value;

  if (newName && newName !== selectedName) {
    fetch("api.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        data_type: "rename_file_or_folder",
        id: selectedId,
        new_name: newName,
        file_type: "file", // or 'folder' depending on the item
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Rename successful!");
          // Refresh the file/folder list or update the UI as needed
          table.refresh(); // Replace with your actual refresh method
        } else {
          alert("Rename failed: " + (data.errors[0] || "Unknown error"));
        }
      })
      .catch((error) => {
        alert("An error occurred: " + error);
      });

    closeRenamePrompt();
  } else {
    alert("Please enter a new name.");
  }
}

//move

function showMovePrompt() {
  document.getElementById("movePrompt").style.display = "block";
}

function closeMovePrompt() {
  document.getElementById("movePrompt").style.display = "none";
}

function moveFile() {
  const fileName = document.getElementById("moveFileName").value;
  const destinationPath = document.getElementById("moveDestination").value;

  fetch("api.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      data_type: "move_file",
      fileName: fileName,
      destinationPath: destinationPath,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      if (data.success) {
        // Reload or update file list
        table.get_files();
      }
      closeMovePrompt();
    })
    .catch((error) => {
      alert("Error: " + error);
    });
}

const table = {
  selected: null,
  selected_id: null,
  page: 1,
  ROWS: [],

  prev: function () {
    table.page -= 1;
    if (table.page < 1) table.page = 1;

    table.refresh(mode.current, table.page);
    document.querySelector(".js-page-number").innerHTML = "Page " + table.page;
  },

  next: function () {
    table.page += 1;

    table.refresh(mode.current, table.page);
    document.querySelector(".js-page-number").innerHTML = "Page " + table.page;
  },

  select: function (e, mode = "leftclick") {
    let old_selected_id = table.selected_id;

    table.selected = null;
    table.selected_id = null;

    let tbody = document.getElementById("table-body");
    for (var i = 0; i < tbody.children.length; i++) {
      tbody.children[i].classList.remove("class_38");
    }

    let item = e.target;
    while (item.tagName != "TR" && item.tagName != "BODY") {
      item = item.parentNode;
    }

    if (item.tagName == "TR") {
      if (
        mode == "rightclick" ||
        old_selected_id == null ||
        item.getAttribute("id") != old_selected_id
      ) {
        table.selected = item;
        table.selected_id = item.getAttribute("id");
        table.selected.classList.add("class_38");

        file_info.show(item.getAttribute("id").replace("tr_", ""));
      } else {
        file_info.hide();
      }
    }
  },

  preview_file: function () {
    let id = table.selected.getAttribute("id").replace("tr_", "");
    window.open("preview.html?id=" + table.ROWS[id].slug, "_blank");
  },

  download_file: function () {
    let id = table.selected.getAttribute("id").replace("tr_", "");
    window.location.href = "download.php?id=" + table.ROWS[id].id;
  },

  add_to_favorites: function () {
    let id = table.selected.getAttribute("id").replace("tr_", "");

    if (table.ROWS[id].file_type == "folder") return;

    let obj = {};
    obj.id = table.ROWS[id].id;
    obj.data_type = "add_to_favorites";

    action.send(obj);
  },

  change_folder_by_id: function (folder_id) {
    FOLDER_ID = parseInt(folder_id);
    table.refresh();
  },

  change_folder: function (e) {
    let item = e.target;
    while (item.tagName != "TR" && item.tagName != "BODY") {
      item = item.parentNode;
    }

    if (item.tagName == "TR") {
      let folder_id = item.getAttribute("folder_id");

      if (folder_id) {
        FOLDER_ID = parseInt(folder_id);
        table.refresh();
      }
    }
  },

  delete_row: function () {
    if (!table.selected) {
      alert("Please select a row to delete!");
      return;
    }

    if (!confirm("Are you sure you want to delete this item?!")) {
      return;
    }

    let obj = {};
    obj.data_type = "delete_row";
    obj.file_type = table.selected.getAttribute("type");

    let id = table.selected.getAttribute("id").replace("tr_", "");
    obj.id = table.ROWS[id].id;
    action.send(obj);
  },

  restore_row: function () {
    if (!table.selected) {
      alert("Please select a row to restore!");
      return;
    }

    if (!confirm("Are you sure you want to restore this item?!")) {
      return;
    }

    let obj = {};
    obj.data_type = "restore_row";
    obj.file_type = table.selected.getAttribute("type");

    let id = table.selected.getAttribute("id").replace("tr_", "");
    obj.id = table.ROWS[id].id;
    action.send(obj);
  },

  refresh: function (MODE = "MY DRIVE", PAGE = 1) {
    //show a loader
    let tbody = document.querySelector("#table-body");
    tbody.innerHTML = `
 			<tr>
 				<td colspan='10' style='text-align:center;padding:10px'>
 					<img src="loader.gif" style="width:100px;height:100px"/>
 				</td>
 			</tr>`;

    //hide file info
    file_info.hide();

    let myform = new FormData();
    myform.append("data_type", "get_files");
    myform.append("mode", MODE);
    myform.append("page", PAGE);
    myform.append("folder_id", FOLDER_ID);

    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          console.log(xhr.responseText);
          //recreate table
          let tbody = document.querySelector("#table-body");
          tbody.innerHTML = "";

          let obj = JSON.parse(xhr.responseText);

          //display usename
          if (!USERNAME) {
            USERNAME = obj.username;
            document.querySelector(".username").innerHTML = obj.username;
          }

          //check if user is logged in
          LOGGED_IN = obj.LOGGED_IN;
          if (!LOGGED_IN) window.location.href = "login.html";

          //update breadcrumbs
          let crumbs = document.querySelector("#breadcrumbs");
          crumbs.innerHTML = `<div onclick="table.change_folder_by_id(0)" class="class_24">My Drive</div>`;

          for (var i = obj.breadcrumbs.length - 1; i >= 0; i--) {
            let class_name = "class_25";
            if (i == 0) class_name = "class_26";

            crumbs.innerHTML += `<div onclick="table.change_folder_by_id(${obj.breadcrumbs[i].id})" class="${class_name}">${obj.breadcrumbs[i].name}</div>`;
          }

          //update drive space
          let drive_occupied = (
            obj.drive_occupied /
            (1024 * 1024 * 1024)
          ).toFixed(2);
          let drive_percent = Math.round(
            (drive_occupied / obj.drive_total) * 100
          );

          DRIVE_OCCUPIED = obj.drive_occupied;
          DRIVE_TOTAL = obj.drive_total;

          document.querySelector(
            ".js-drive-space-text"
          ).innerHTML = `${drive_occupied}GB / ${obj.drive_total}GB`;
          document.querySelector(
            ".js-drive-space-percent"
          ).style.width = `${drive_percent}%`;

          if (obj.success && obj.data_type == "get_files") {
            table.ROWS = obj.rows;

            for (var i = 0; i < obj.rows.length; i++) {
              let tr = document.createElement("tr");
              tr.setAttribute("id", "tr_" + i);

              if (obj.rows[i].file_type == "folder") {
                tr.setAttribute("type", "folder");
              } else {
                tr.setAttribute("type", "file");
              }

              if (obj.rows[i].file_type == "folder")
                tr.setAttribute("folder_id", +obj.rows[i].id);

              let star = "";
              if (obj.rows[i].file_type != "folder") {
                star = '<i class="bi bi-star class_34"></i>';
                if (obj.rows[i].favorite == 1)
                  star =
                    '<i class="bi bi-star-fill class_34" style="color:rgb(255, 21, 226)"></i>';
              }

              let download_link = "";
              if (obj.rows[i].file_type != "folder") {
                download_link = `
									<a href="download.php?id=${obj.rows[i].id}">
										<i class="bi bi-cloud-download-fill class_34"></i>
									</a>`;
              }

              let share_mode = `<i title="not shared" class="bi bi-person-x-fill class_34"></i>`;
              if (obj.rows[i].share_mode == 1) {
                share_mode = `<i title="shared with specific users" class="bi bi-people-fill class_34"></i>`;
              } else if (obj.rows[i].share_mode == 2) {
                share_mode = `<i title="shared to public" class="bi bi-globe-europe-africa class_34"></i>`;
              }

              tr.innerHTML = `
									<td>${obj.rows[i].icon}</td>
									<td style="max-width: 200px;" >${obj.rows[i].file_name}</td>
									<td>${star}</td>
									<td style="max-width: 200px;">${obj.rows[i].file_type}</td>
									<td>${share_mode}</td>
									<td>${obj.rows[i].date_updated}</td>
									<td>${obj.rows[i].file_size}</td>
									<td>
										${download_link}
									</td>
								`;

              tbody.appendChild(tr);
            }
          } else {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align:center">No files found!</td></tr>`;
          }
        } else {
          console.log(xhr.responseText);
        }
      }
    });

    xhr.open("post", "api.php", true);
    xhr.send(myform);
  },

  logout: function () {
    let myform = new FormData();
    myform.append("data_type", "user_logout");

    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          //console.log(xhr.responseText);
          window.location.href = "login.html";
        } else {
          console.log(xhr.responseText);
        }
      }
    });

    xhr.open("post", "api.php", true);
    xhr.send(myform);
  },
};

//cancel upload

const upload = {
  cancelled: false,
  uploading: false,

  cancel: function () {
    upload.cancelled = true;
  },

  dropZone: {
    highlight: function () {
      document.querySelector(".drop-zone").classList.add("drop-zone-highlight");
    },
    removeHighlight: function () {
      document
        .querySelector(".drop-zone")
        .classList.remove("drop-zone-highlight");
    },
  },

  drop: function (e) {
    e.preventDefault();
    upload.dropZone.removeHighlight();
    upload.send(e.dataTransfer.files);
  },

  dragOver: function () {
    event.preventDefault();
    upload.dropZone.highlight();
  },

  reset_progress: function () {
    document.querySelector(".js-prog").style.width = "0%";
    document.querySelector(".js-prog-text").innerHTML = "0%";
    document.querySelector(".js-prog-holder").classList.add("hide");
  },

  send: function (files) {
    if (upload.uploading) {
      alert("Please wait for the upload to complete!");
      return;
    }

    upload.uploading = true;
    upload.cancelled = false;
    let myform = new FormData();

    myform.append("data_type", "upload_files");
    myform.append("folder_id", FOLDER_ID);

    let file_size = 0;
    for (var i = 0; i < files.length; i++) {
      file_size += files[i].size;
      myform.append("file" + i, files[i]);
    }

    let drive_total = DRIVE_TOTAL * (1024 * 1024 * 1024);

    if (
      parseInt(DRIVE_OCCUPIED) + parseInt(file_size) >
      DRIVE_TOTAL * (1024 * 1024 * 1024)
    ) {
      alert("There is not enough space to save files");
      return;
    }

    upload.reset_progress();
    document.querySelector(".js-prog-holder").classList.remove("hide");

    let xhr = new XMLHttpRequest();

    xhr.addEventListener("error", function (e) {
      alert("An error occured! Please check your connection");
    });

    xhr.upload.addEventListener("progress", function (e) {
      let percent = Math.round((e.loaded / e.total) * 100);
      document.querySelector(".js-prog").style.width = percent + "%";
      document.querySelector(".js-prog-text").innerHTML = percent + "%";

      if (upload.cancelled) {
        xhr.abort();
        alert("Your upload was cancelled!");
        upload.reset_progress();
      }
    });

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          let obj = JSON.parse(xhr.responseText);
          if (obj.success) {
            table.refresh();
          } else {
            alert("Could not complete upload!");
            if (typeof obj.errors != "undefined") {
              for (key in obj.errors) {
                alert(obj.errors[key]);
              }
            }
          }

          upload.reset_progress();
        } else {
          console.log(xhr.responseText);
          alert("An error occured! Please try again later");
        }

        upload.uploading = false;
      }
    });

    xhr.open("post", "api.php", true);
    xhr.send(myform);
  },
};

// file information

var file_info = {
  show: function (id) {
    let row = table.ROWS[id];

    document.querySelector(".js-info-no-file").classList.add("hide");
    let file_info_panel = document.querySelector(".js-file-info");
    file_info_panel.classList.remove("hide");
    file_info_panel.querySelector(".file_name").innerHTML = row.file_name;
    file_info_panel.querySelector(".size").innerHTML = row.file_size;
    file_info_panel.querySelector(".type").innerHTML = row.file_type;
    file_info_panel.querySelector(".date_created").innerHTML = row.date_created;
    file_info_panel.querySelector(".date_updated").innerHTML = row.date_updated;
  },

  hide: function () {
    document.querySelector(".js-info-no-file").classList.remove("hide");
    document.querySelector(".js-file-info").classList.add("hide");
  },
};

const action = {
  uploading: false,
  cancelled: false,
  root_path: "http://localhost/templates/mydrive/",

  new_folder: function () {
    let box = document.querySelector(".js-new-folder");
    let text = box.querySelector("input").value.trim();
    box.classList.add("hide");

    let obj = {};
    obj.data_type = "new_folder";
    obj.name = text;
    obj.folder_id = FOLDER_ID;

    action.send(obj);
  },

  share_file: function () {
    let box = document.querySelector(".js-share");
    let radios = box.querySelectorAll(".radio");
    let share_mode = 0;

    for (var i = radios.length - 1; i >= 0; i--) {
      if (radios[i].checked) share_mode = radios[i].value;
    }

    box.classList.add("hide");

    //grab all share email addresses
    let inputs = document
      .querySelector(".js-access-email-holder")
      .querySelectorAll("input");
    let emails = [];
    for (var i = 0; i < inputs.length; i++) {
      emails[i] = inputs[i].value;
    }

    let obj = {};
    let id = table.selected.getAttribute("id").replace("tr_", "");
    obj.id = table.ROWS[id].id;
    obj.emails = JSON.stringify(emails);
    obj.data_type = "share_file";
    obj.share_mode = share_mode;
    obj.folder_id = FOLDER_ID;

    action.send(obj);
  },

  show_new_folder: function () {
    let box = document.querySelector(".js-new-folder");
    box.classList.remove("hide");
    box.querySelector("input").value = "";
    box.querySelector("input").focus();
  },

  show_share_file: function () {
    //get selected file info
    let id = table.selected.getAttribute("id").replace("tr_", "");

    let box = document.querySelector(".js-share");
    box.classList.remove("hide");
    box.querySelector(".js-share-filename").innerHTML =
      table.ROWS[id].file_name;
    box.querySelector(".js-share-link").value =
      action.root_path + "preview.html?id=" + table.ROWS[id].slug;

    box.querySelector(
      ".js-share-mode-" + table.ROWS[id].share_mode
    ).checked = true;

    box.querySelector(".js-share-link").focus();

    share.refresh(table.ROWS[id].emails);
  },

  send: function (obj) {
    if (action.uploading) {
      alert("Please wait for the upload to complete!");
      return;
    }

    action.uploading = true;
    action.cancelled = false;
    let myform = new FormData();

    for (key in obj) {
      myform.append(key, obj[key]);
    }

    let xhr = new XMLHttpRequest();

    xhr.addEventListener("error", function (e) {
      alert("An error occured! Please check your connection");
    });

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          action.handle_result(xhr.responseText);
        } else {
          console.log(xhr.responseText);
          alert("An error occured! Please try again later");
        }

        action.uploading = false;
      }
    });

    xhr.open("post", "api.php", true);
    xhr.send(myform);
  },

  handle_result: function (result) {
    console.log(result);
    let obj = JSON.parse(result);

    if (obj.success) {
      table.refresh(mode.current);
    } else {
      alert("Could not complete operation!");
    }
  },
};

table.refresh();

window.addEventListener("click", function () {
  submenu.hide();
});
