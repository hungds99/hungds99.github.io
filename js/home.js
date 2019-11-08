// ===================== COMMON DEFINE ==================== 
// Formatter VND
const formatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
})

// Auto Generate ID
function generateUUIDV4() {
    return 'xxx-xxy'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ==================== DATABASE ==========================
let DATABASE = localStorage.getItem('DATABASE') ? JSON.parse(localStorage.getItem('DATABASE')) : {
    PRODUCTS: [],
    ACCOUNTS: [
        // Set User Default role ADMIN
        {
            ID: generateUUIDV4(),
            username: "Đinh Sỹ Hùng",
            phoneNumber: "01672058923",
            address: "Hải Châu Đà Nẵng",
            email: "admin@gmail.com",
            password: "123",
            role: "Admin"
        }
    ],
    ORDERS: []
};

localStorage.setItem('DATABASE', JSON.stringify(DATABASE));

// Get table to use
let PRODUCTS = DATABASE.PRODUCTS;
let ACCOUNTS = DATABASE.ACCOUNTS;
let ORDERS = DATABASE.ORDERS;

// ==================== SESSION STORE ==========================
let SESSION = sessionStorage.getItem('SESSION') ? JSON.parse(sessionStorage.getItem('SESSION')) : null;

// ========================================= CART CLIENT ===========================================
let btn_cart = document.getElementById('btn-cart');
let cart_overlay = document.getElementById('cart-overlay');
let close_cart = document.getElementById('close-cart');
let cart_tbody = document.getElementById('cart-tbody');
// let cart_quantity = document.getElementById('cart-quantity');

btn_cart.addEventListener('click', cartOverlayOn);
close_cart.addEventListener('click', cartOverlayOff);

function cartOverlayOn() {
    cart_overlay.style.display = 'block';
    renderCartItems();
}

function cartOverlayOff() {
    cart_overlay.style.display = 'none';
}

// Cart Render Items
function renderCartItems() {
    let checkout = document.getElementById('checkout');
    let total_inner = document.getElementById('total');
    let products = SESSION.products;
    let contents = '';
    let total = 0;

    if (products === undefined || products.length === 0) {
        total_inner.innerHTML = `<p class="text-center">Không có sản phẩm trong giỏ.</p>`;
        checkout.style.display = 'none';
    } else {
        checkout.style.display = 'block';
        products.forEach(p => {
            contents += `
            <tr>
                <td>
                    <img src="images/${p.image}" alt="">
                </td>
                <td>
                    <p>${p.productName}</p>
                    <p>${formatter.format(p.price)}</p>
                </td>
                <td>
                    ${p.quantity}
                </td>
                <td>
                    ${formatter.format(p.price * p.quantity)}
                </td>
                <td>
                    
                </td>
            </tr>`;
            total += (p.price * p.quantity);
        })
        total_inner.innerHTML = `Tổng Tiền: ${formatter.format(total)}`;
        cart_tbody.innerHTML = contents;
    }
}


// ========================================= FORM ACCOUNT CLIENT ===========================================
let regiseter_form = document.getElementById('regiseter-form');
let login_form = document.getElementById('login-form');
let login_form_area = document.getElementById('login-form-area');
let regiseter_form_area = document.getElementById('regiseter-form-area');

regiseter_form.addEventListener('click', showRegisterForm);
login_form.addEventListener('click', showSignForm);

function showRegisterForm() {
    login_form_area.style.display = 'none';
    regiseter_form_area.style.display = 'block';
}

function showSignForm() {
    login_form_area.style.display = 'block';
    regiseter_form_area.style.display = 'none';
}

// ********************** REGISTER ACCOUNT **********************
// Declare Form Input
let name = document.getElementById('name');
let number = document.getElementById('number');
let address = document.getElementById('address');
let email = document.getElementById('email');
let password = document.getElementById('password');
// let condition = document.getElementById('condition');

let register_btn = document.getElementById('register');
register_btn.addEventListener('click', addNewAccount);

function addNewAccount() {
    let account = {
        ID: generateUUIDV4(),
        username: name.value,
        phoneNumber: number.value,
        address: address.value,
        email: email.value,
        password: password.value,
        role: "User"
    }
    if (validateFormRegister()) {
        ACCOUNTS.push(account);
        localStorage.setItem('DATABASE', JSON.stringify(DATABASE));
        alert("Tạo Tài Khoản Thành Công !");
        showSignForm();
    }
    register_btn.disabled = false;
}

function validateFormRegister() {
    let register_input = regiseter_form_area.querySelectorAll('input');
    let check = 0;

    register_input.forEach(input => {
        if (input.value === '') {
            input.style.border = "1px solid red";
            check++;
        } else {
            input.style.border = "1px solid #ced4da";
        }
    });

    // Stupid again :))
    if (check > 0) {
        register_btn.disabled = true;
        return false;
    } else {
        return true;
    }
}

// ********************** SIGNIN ACCOUNT **********************
let email_login = document.getElementById('email-login');
let password_login = document.getElementById('password-login');

let userAct = document.getElementById('userAct');
let userProfile = document.getElementById('userProfile');
let adminProfile = document.getElementById('adminProfile');

let sign_btn = document.getElementById('signin');
sign_btn.addEventListener('click', actSignIn);

function actSignIn() {
    let valueOfAuthen = authenticate(email_login.value, password_login.value);
    if (valueOfAuthen !== null) {
        alert('Đăng Nhập Thành Công !');
        sessionStorage.setItem('SESSION', JSON.stringify(valueOfAuthen));
        $('#form_account').modal('hide');
        checkSession();
    } else {
        alert('Đăng Nhập Thất Bại !');
    }
}

// Authenticate Account
function authenticate(email_login, password_login) {
    let userIDAndRole = null;
    ACCOUNTS.forEach(account => {
        if (account.email === email_login && account.password === password_login) {
            userIDAndRole = {
                userID: account.ID,
                role: account.role
            }
        }
    });
    return userIDAndRole;
}

window.onload = checkSession();

// Check Session Storage
function checkSession() {
    SESSION = JSON.parse(sessionStorage.getItem('SESSION'));

    if (SESSION === null) {
        userAct.style.display = 'flex';
        userProfile.style.display = 'none';
        adminProfile.style.display = 'none';
    } else {
        if (SESSION.role === 'User') {
            userAct.style.display = 'none';
            userProfile.style.display = 'block';
            adminProfile.style.display = 'none';
        } else {
            userAct.style.display = 'none';
            userProfile.style.display = 'none';
            adminProfile.style.display = 'block';
        }
    }
}

// ========================================= PROFILE ACCOUNT CLIENT ===========================================
userProfile.addEventListener('click', actProfileToggle);
adminProfile.addEventListener('click', actProfileToggle);

let logout = document.getElementById('logout');

logout.addEventListener('click', function () {
    sessionStorage.clear();
    location.reload();
})

function actProfileToggle() {
    SESSION = JSON.parse(sessionStorage.getItem('SESSION'));

    ACCOUNTS.forEach(function (account) {
        if (account.ID === SESSION.userID) {
            renderProfileDetail(account);
            renderProfileOrder(account.ID);
        }
    })
}

function renderProfileDetail(account) {
    let p_name = document.getElementById('p_name');
    let p_number = document.getElementById('p_number');
    let p_email = document.getElementById('p_email');
    let p_address = document.getElementById('p_address');
    let p_nameTitle = document.getElementById('p_nameTitle');

    p_nameTitle.innerText = account.username;
    p_name.value = account.username;
    p_number.value = account.phoneNumber;
    p_email.value = account.email;
    p_address.value = account.address;

    let manager = document.getElementById('manager');
    if (account.role === "Admin") {
        manager.style.display = 'block';
    } else {
        manager.style.display = 'none';
    }

    // *** Update User Pr0fi|e ***
    let updateProfile = document.getElementById('updateProfile');
    updateProfile.addEventListener('click', updateUserProfile);

    function updateUserProfile() {
        account.username = p_name.value;
        account.phoneNumber = p_number.value;
        account.email = p_email.value;
        account.address = p_address.value;
        localStorage.setItem('DATABASE', JSON.stringify(DATABASE));
        alert('Update Thành Công !');
    }
}

function renderProfileOrder(ID) {
    let profileTbody = document.getElementById('profileTbody');
    let content = '';
    ORDERS.forEach(order => {
        if (order.userID === ID) {
            let productList = ``;
            let total_price = 0;
            order.products.forEach(p => {
                productList += `
                    ${p.productName} (x${p.quantity})<br>
                `
                total_price += p.quantity * p.price
            });

            content += `
            <tr>
                <th scope="row" class="text-info">${order.orderId}</th>
                <td>${order.createDate}</td>
                <td>${productList}</td>
                <td>${formatter.format(total_price)}</td>
                <td class="text-center">${order.status}</td>
            </tr>
            `;
        }
    })
    profileTbody.innerHTML = content;
}

// ********************** Show Profile *****************************
let s_profileInfo = document.getElementById('s_profileInfo');
let s_profileOrder = document.getElementById('s_profileOrder');

s_profileInfo.addEventListener('click', showProfileInfo);
s_profileOrder.addEventListener('click', showProfileOrder);

function showProfileInfo() {
    document.getElementById('account-info').style.display = 'block';
    document.getElementById('order-info').style.display = 'none';
}

function showProfileOrder() {
    document.getElementById('account-info').style.display = 'none';
    document.getElementById('order-info').style.display = 'block';
}

// ========================================= PRODUCT CLIENT ===========================================
let owl_slide = document.getElementById('owl-slide');
let extra_product = document.getElementById('extra-product');
let all_product = document.getElementById('all-product');

window.onload = loadProduct(PRODUCTS);

function loadProduct(PRODUCTS) {
    PRODUCTS.forEach(product => {
        if (product.idcategory === "2") {
            renderExtraProduct(product);
        } else {
            renderProduct(product);
        }
        renderAllProduct(product);
    });

    let owl = $('.owl-carousel');
    owl.owlCarousel({
        items: 4,
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 1500,
        autoplayHoverPause: true
    });
}

function renderProduct(product) {
    let contents = `
        <div class="card" style="width: 18rem;" data-aos="fade-left">
            <img src="images/${product.image}" class="card-img-top" alt="">
            <div class="card-body">
                <h5 class="card-title">${product.productName}</h5>
                <p class="card-text">${formatter.format(product.price)}</p>
                <button class="btn btn-primary btn-sm" id="addCart" data-code="${product.code}">Thêm Giỏ Hàng</button>
            </div>
        </div>`;
    owl_slide.innerHTML += contents;
}

function renderExtraProduct(product) {
    let contents = `
    <div class="card text-center col-3 mb-2" data-aos="zoom-in-down">
        <img src="images/${product.image}" class="card-img-top" alt="">
        <div class="card-body">
            <h5 class="card-title">${product.productName}</h5>
            <p class="card-text">${formatter.format(product.price)}</p>
            <button class="btn btn-primary btn-sm" id="addCart" data-code="${product.code}">Thêm Giỏ Hàng</button>
        </div>
    </div>`;
    extra_product.innerHTML += contents;
}

function renderAllProduct(product) {
    let contents = `
        <div class="card col-3 text-center mb-2" data-aos="zoom-in-right">
            <img src="images/${product.image}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${product.productName}</h5>
                <p class="card-text">${formatter.format(product.price)}</p>
                <button class="btn btn-primary btn-sm" id="addCart" data-code="${product.code}">Thêm Giỏ Hàng</button>
            </div>
        </div>
        `;
    all_product.innerHTML += contents;
}

// **********************  FILTER PRODUCT **********************
let filter_option = document.getElementById('filter-option');
filter_option.addEventListener('change', filterProduct);

function filterProduct() {
    let option = filter_option.value;
    if (option === 'priceUp') {
        PRODUCTS.sort(function (p1, p2) {
            return p1.price - p2.price;
        })
        all_product.innerHTML = '';
        PRODUCTS.forEach(product => renderAllProduct(product));
    }
    if (option === 'priceDown') {
        PRODUCTS.sort(function (p1, p2) {
            return p2.price - p1.price;
        })
        all_product.innerHTML = '';
        PRODUCTS.forEach(product => renderAllProduct(product));
    }
}

// ****************** Search ********************************
let search = document.getElementById("search");
search.addEventListener('input', actSearch);

function actSearch() {
    let searchInput = search.value;
    let productCompare = PRODUCTS.filter(product => searchCompare(searchInput, product.productName));
    all_product.innerHTML = '';
    productCompare.forEach(product => {
        renderAllProduct(product);
    });
}

// Search Compare
function searchCompare(searchInput, productName) {
    let searchInputLower = searchInput.toLowerCase();
    let productNameLower = productName.toLowerCase();
    return productNameLower.includes(searchInputLower);
}

// ========================================= CART CLIENT ===========================================
// ********************** ADD CART **********************
let addCarts = document.querySelectorAll('#addCart');

addCarts.forEach(function (addCart) {
    addCart.addEventListener('click', addToCart);
})

function addToCart() {
    let productCode = this.getAttribute('data-code');
    let products = SESSION.products;
    let productSaveCart;

    PRODUCTS.forEach(p => {
        if (p.code === productCode) {
            productSaveCart = p;
        }
    })

    let { image, productName, price } = productSaveCart;

    let product = {
        code: productCode,
        productName: productName,
        price: price,
        image: image,
        quantity: 1
    }

    if (products !== undefined) {
        let check = 0;
        products.forEach(p => {
            if (p.code === productCode) {
                p.quantity = p.quantity + 1;
                check++;
            }
        })

        if (check === 0) {
            products.push(product);
        }

    } else {
        SESSION.products = [];
        SESSION.products.push(product);
    }

    sessionStorage.setItem('SESSION', JSON.stringify(SESSION));
    alert('Thêm Sản Phẩm Vào Giỏ Hàng Thành Công !');

}

// ********************** CART DETAIL **********************
let checkout = document.getElementById('checkout');
let body_content = document.getElementById('body-content');
let body_cart = document.getElementById('body-cart');

let cart_table = document.getElementById('cart-table');

checkout.addEventListener('click', showCartDetail);

function showCartDetail() {
    cartOverlayOff();
    body_content.style.display = 'none';
    body_cart.style.display = 'block';
    renderCartDetail();
}

function renderCartDetail() {
    let products = SESSION.products;
    let contents = '';
    let total_price = 0;
    let total_quantity = 0;

    products.forEach(p => {
        contents += `
        <tr>
            <td>
                <img width="50" height="25" src="images/${p.image}" alt="">
            </td>
            <td>${p.productName}</td>
            <td>${formatter.format(p.price)}</td>
            <td>
                <i class="fas fa-minus-circle text-secondary" id="minus" data-code="${p.code}"></i>
                <input type="text" value="${p.quantity}" min="1" style="width: 35px; padding-left: 8px;" disabled />
                <i class="fas fa-plus-circle text-success" id="plus" data-code="${p.code}"></i>
            </td>
            <td>${formatter.format(p.price * p.quantity)}</td>
            <td>
                <i class="fas fa-times text-danger" id="remove" data-code="${p.code}"></i>
            </td>
        </tr> `;
        total_price += p.price * p.quantity;
        total_quantity += p.quantity;
    });

    cart_table.innerHTML = contents;
    document.getElementById('payment-info').innerHTML = `
        <div class="col-6">
            <p>Tổng số lượng:</p>
            <p>Tổng giá:</p>
            <p>Giảm giá:</p>
            <p>Thành tiền:</p>
        </div>
        <div class="col-6">
            <p>${total_quantity}</p>
            <p>${formatter.format(total_price)}</p>
            <p>0 ₫</p>
            <p>${formatter.format(total_price)}</p>
        </div>
    `;
    loadUserInfo();
}

function loadUserInfo() {
    ACCOUNTS.forEach(function (account) {
        if (account.ID === SESSION.userID) {
            renderUserInfo(account);
        }
    })
}
let customer_name = document.getElementById('customer-name');
let customer_number = document.getElementById('customer-number');
let customer_address = document.getElementById('customer-address');
let customer_email = document.getElementById('customer-email');
let customer_note = document.getElementById('customer-note');
let customer_check = document.getElementById('customer-check');

function renderUserInfo(account) {
    customer_name.value = account.username;
    customer_number.value = account.phoneNumber;
    customer_address.value = account.address;
    customer_email.value = account.email;
}

// ********************** CART ACTION **********************
cart_table.addEventListener('click', actCartProduct);

function actCartProduct(event) {
    let ev = event.target;
    let data_code = ev.getAttribute('data-code');

    if (ev.matches('#minus')) {
        let nValue = parseInt(ev.nextElementSibling.value) - 1;
        if (nValue <= 0) {
            nValue = 1;
            ev.nextElementSibling.value = nValue;
        } else {
            ev.nextElementSibling.value = nValue;
        }
        updateCartProduct(data_code, nValue);
    }

    if (ev.matches('#plus')) {
        let nValue = parseInt(ev.previousElementSibling.value) + 1;
        ev.previousElementSibling.value = nValue;
        updateCartProduct(data_code, nValue);
    }

    if (ev.matches('#remove')) {
        let products = SESSION.products;
        products = products.filter(product => product.code !== data_code);
        SESSION.products = products;
        sessionStorage.setItem('SESSION', JSON.stringify(SESSION));
        renderCartDetail();
    }
}

function updateCartProduct(code, nQuantity) {
    let products = SESSION.products;

    products.forEach(p => {
        if (p.code === code) {
            p.quantity = nQuantity;
        }
    })

    sessionStorage.setItem('SESSION', JSON.stringify(SESSION));
    renderCartDetail();
}

// ********************** ORDER ACTION **********************
let order_btn = document.getElementById('order');

order_btn.addEventListener('click', actOrder);

function actOrder() {
    let order = {
        orderId: generateUUIDV4(),
        userID: SESSION.userID,
        customerInfo: {
            customerName: customer_name.value,
            customerNumber: customer_number.value,
            customerAddress: customer_address.value,
            customerEmail: customer_email.value,
            customerNote: customer_note.value
        },
        payMethod: 'Giao Hàng Tại Nhà',
        products: SESSION.products,
        createDate: moment(new Date()).format("DD/MM/YYYY"),
        status: 'Đặt Hàng'
    }

    if (validateForm()) {
        ORDERS.push(order);
        localStorage.setItem('DATABASE', JSON.stringify(DATABASE));
        alert('Đặt hàng thành công !');
        SESSION.products = [];
        sessionStorage.setItem('SESSION', JSON.stringify(SESSION));
        location.reload();
    }

    order_btn.disabled = false;
}

function validateForm() {
    let customer_form = document.getElementById('customer-form');
    let customer_input = customer_form.querySelectorAll('input');
    let check = 0;
    customer_input.forEach(input => {
        if (input.value === '') {
            input.style.border = "1px solid red";
            check++;
        } else {
            input.style.border = "1px solid #ced4da";
        }
    })

    // Stupid again :))
    if (check > 0) {
        order_btn.disabled = true;
        return false;
    } else {
        return true;
    }
}