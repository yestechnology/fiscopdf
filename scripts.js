$(document).ready(function() {
  $(".file-input").change(function() {
    var all_files = this.files;
    if(all_files.length == 0) {
      return;
    }
    var file = all_files[0];
    var fileName = file.name;
    var tipoFiscal = $(this).data('tipo-fiscal');
    var reader = new FileReader();
    reader.addEventListener('load', function(e) {
      var text = e.target.result;
      $(".file-input").val('');
      upload(tipoFiscal, fileName, text);
    });
    reader.addEventListener('error', function() {
      $(".file-input").val('');
      showError("Erro ao ler arquivo XML");
    });
    reader.readAsText(file);
  });
});

function upload(tipoFiscal, fileName, contents) {
  var ajax = new XMLHttpRequest();
  ajax.open(
    "POST",
    "https://ms-sped.public.production.lb1.tecnologiafox.com.br/da" + tipoFiscal + "/" + fileName + ".pdf",
    true
  );
  ajax.responseType = 'blob';
  ajax.send(contents);
  showLoading();
  ajax.onreadystatechange = function() {
    if (ajax.readyState == XMLHttpRequest.DONE) {
      Swal.close();
      if (ajax.status == 200) {
        showSuccess();
        var data = new Blob([ajax.response]);
        download(fileName + ".pdf", data);
      } else {
        showError("Erro ao gerar arquivo PDF do XML escolhido.")
      }
    }
  }
}

function download(filename, blob) {
  var element = document.createElement('a');
  element.setAttribute('href', window.URL.createObjectURL(blob));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function showError(msg) {
  Swal.fire({
    title: 'Erro',
    text: msg,
    type: 'error'
  })
}

function showSuccess(msg) {
  Swal.fire({
    title: 'Sucesso',
    text: 'PDF gerado com sucesso.',
    type: 'success'
  })
}

function showLoading() {
  Swal.fire({
    title: 'Processando...',
    onBeforeOpen: () => {
      Swal.showLoading()
    }
  })
}
