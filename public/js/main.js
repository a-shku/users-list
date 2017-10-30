function sendData(url, method, data, cb) {
  $.ajax({
    url: url,
    method: method,
    data: data,
    contentType: 'application/json',
    success: function(data) {
      cb(data);
    }
  });
}

// сброс значений формы
$('#myReset').on('click', e => {
  e.preventDefault();
  reset();
});

// сброс формы
function reset() {
  var form = document.forms['userForm'];
  form.elements['id'].value = 0;
  form.reset();
}

// создание строки для таблицы
var row = function(user) {
  return `<tr data-rowid='${user._id}'><td>${user._id}</td><td>${user.name}</td> <td>${user.age}</td><td><a class='editLink' data-id='${user._id}'>Изменить</a> | <a class='removeLink' data-id='${user._id}'>Удалить</a></td></tr>`;
};

function getUsers() {
  sendData('/api/users', 'GET', {}, users => {
    let rows = '';
    $.each(users, (index, user) => {
      rows += row(user)
    });
    $('table tbody').append(rows);
  });
}

function getUser(id) {
  sendData('/api/users/' + id, 'GET', {}, user => {
    console.log(user);
    let form = document.forms['userForm'];
    form.elements['id'].value = user._id;
    form.elements['name'].value = user.name;
    form.elements['age'].value = user.age;
  })
}

function createUser(user) {
  sendData('/api/users', 'POST', JSON.stringify(user), user => {
    reset();
    $('table tbody').append(row(user));
  })
}

function editUser(id, user) {
  sendData('/api/users/' + id, 'PUT', JSON.stringify(user), user => {
    reset();
    $('tr[data-rowid="' + user._id + '"]').replaceWith(row(user));
  })
}

function deleteUser(id) {
  sendData('/api/users/' + id, 'DELETE', {}, user => {
    $('tr[data-rowid="' + user._id + '"]').remove();
  })
}

$('form').on('submit', function(e) {
  e.preventDefault();
  let id = this.elements['id'].value;
  let name = this.elements['name'].value;
  let age = this.elements['age'].value;

  if (id == 0) {
    createUser({name, age});
  } else {
    editUser(id, {name, age});
  }
});

$('table tbody').on('click', '.removeLink', function() {
  let id = $(this).data('id');
  deleteUser(id);
})

$('table tbody').on('click', '.editLink', function() {
  let id = $(this).data('id');
  getUser(id);
})

getUsers();