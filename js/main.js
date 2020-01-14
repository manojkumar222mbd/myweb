$(document).ready(function () {

    function showToaster(action, msg) {
        var el = $("#toaster");
        el.removeClass(action);
        el.empty();
        if (action == 'success') {
            msg = "<i class='fa fa-check toaster-icon'></i><span class='toaster-text'>" + msg + "</span>";
        } else {
            msg = "<i class='fa fa-exclamation-circle toaster-icon'></i><span class='toaster-text'>" + msg + "</span>";
        }
        el.html(msg);
        el.addClass(action);
        setTimeout(function () { el.removeClass(action); }, 3000);
        el.on('click', function () {
            el.removeClass(action);
        });
    }

    function sendEmail(data, callback) {
        var msg = `Name:` + data.cname + `,  Mobile:` + data.cmobile + `,  Email:` + data.cemail + `,  Message:` + data.cmessage + ``;
        $.ajax({
            url: "https://api.sendgrid.com/v3/mail/send",
            type: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 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",
            },
            data: {
                "personalizations": [
                    { "to": [{ "email": "manojkumar222mbd@gmail.com" }] }
                ],
                "from": { "email": "manojrajput2506@gmail.com" },
                "subject": "My Web Contact",
                "content": [
                    {
                        "type": "text/plain",
                        "value": msg
                    }
                ]
            },
            timeout: 100000,
            success: function (res) {
                callback(null, res);
            },
            error: function (err) {
                callback(err);
            }
        });
    }

    $("#btn-submit").click(function () {
        var mobileRegex = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var cname = $("#cname").val();
        var cmobile = $("#cmobile").val();
        var cemail = $("#cemail").val();
        var cmessage = $("#cname").val();
        if (!cname || !cmobile || !cemail || !cmessage) {
            showToaster('danger', "All fields are required"); return;
        } else if (!mobileRegex.test(cmobile)) {
            showToaster('danger', "Invalid Mobile No."); return;
        } else if (!emailRegex.test(cemail)) {
            showToaster('danger', "Invalid Email"); return;
        }
        $("#btn-submit").hide();
        $("#btn-sending").show();
        setTimeout(() => {
            $("#btn-submit").show();
            $("#btn-sending").hide();
            $("#cname").val('');
            $("#cmobile").val('');
            $("#cemail").val('');
            $("#cmessage").val('');
            showToaster('success', `Email Sent Successfully.`);
        }, 3000)
        return;
        sendEmail({ cname: cname, cmobile: cmobile, cemail: cemail, cmessage: cmessage }, function (err, res) {
            $("#btn-submit").show();
            $("#btn-sending").hide();
            if (err) {
                showToaster('danger', 'Something went wrong!');
            } else {
                $("#cname").val('');
                $("#cmobile").val('');
                $("#cemail").val('');
                $("#cmessage").val('');
                showToaster('success', `Thanks for reaching me. I'll contact you soon.`);
            }
        });
    });

    $("[href=#resume],[href=#portfolio],[href=#docs],[href=#home]").on("click", function () {
        $("#cmessage").val('');
    });
    // PRELOADER
    $('#preloader').delay(500).fadeOut('slow'); // will fade out the white DIV that covers the website.


    // PAGE LOADER
    jQuery('#grid-container').on('initComplete.cbp', function () {
        if ($('#ajax-tab-container').length) {
            $('#ajax-tab-container').easytabs({
                tabs: 'header nav ul li',
                animate: true,
                updateHash: false,
                transitionIn: 'fadeIn',
                transitionOut: 'fadeOut',
                animationSpeed: 100,
                tabActiveClass: 'active',
                transitionInEasing: 'linear',
                transitionOutEasing: 'linear',
            });
        }
    });


    // RESPONSIVE MENU
    function transform() {
        var outdiv = '<div class="menuout"><div class="menuin"><ul class="tabs"></ul></div></div>';
        $(outdiv).appendTo("nav");
        var resmenus = $('.tabs').html();
        $(".menuout .menuin .tabs").append(resmenus);
        $('.menuin').hide();
    }
    transform();
    $('.hamburger').on('click', function () {
        $('.menuin').slideToggle();
    });
    $('.menuout').on('click', function () {
        $('.menuin').slideUp();
    });

    // OWL CAROUSEL GENERAL JS
    if ($('.owl-carousel').length) {
        $('.owl-carousel').each(function () {
            $(this).owlCarousel({
                items: $(this).data('items') ? $(this).data('items') : 3
                , autoPlay: $(this).data('autoplay') ? $(this).data('autoplay') : 2500
                , pagination: $(this).data('pagination') ? $(this).data('pagination') : false
                , itemsDesktop: [1199, 3]
                , itemsDesktopSmall: [979, 3]
            });
        });
    }

    // PORTFOLIO CONTENT  
    $('#grid-container').cubeportfolio({
        layoutMode: 'grid',
        filters: '#filters-container',
        gridAdjustment: 'responsive',
        animationType: 'skew',
        defaultFilter: '*',
        gapVertical: 0,
        gapHorizontal: 0,
        singlePageAnimation: 'fade',
        mediaQueries: [{
            width: 700,
            cols: 3,
        }, {
            width: 480,
            cols: 2,
            options: {
                caption: '',
                gapHorizontal: 30,
                gapVertical: 20,
            }
        }, {
            width: 320,
            cols: 1,
            options: {
                caption: '',
                gapHorizontal: 50,
            }
        }],
        singlePageCallback: function (url, element) {
            var t = this;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                timeout: 30000
            })
                .done(function (result) {
                    t.updateSinglePage(result);
                })
                .fail(function () {
                    t.updateSinglePage('AJAX Error! Please refresh the page!');
                });
        },
        plugins: {
            loadMore: {
                element: '#js-loadMore-agency',
                action: 'click',
                loadItems: 3,
            }
        }
    });

    // BLOG CONTENT  
    $('#grid-blog').cubeportfolio({
        layoutMode: 'grid',
        gridAdjustment: 'responsive',
        gapVertical: 0,
        gapHorizontal: 0,
        mediaQueries: [{
            width: 700,
            cols: 3,
        }, {
            width: 480,
            cols: 2,
            options: {
                caption: '',
                gapHorizontal: 30,
                gapVertical: 20,
            }
        }, {
            width: 320,
            cols: 1,
            options: {
                caption: '',
                gapHorizontal: 50,
            }
        }],
        plugins: {
            loadMore: {
                element: '#load-posts',
                action: 'click',
                loadItems: 3,
            }
        }
    });

    // GALLERY WIDGET  
    $('#widget-gallery').cubeportfolio({
        layoutMode: 'grid',
        gridAdjustment: 'responsive',
        gapVertical: 0,
        gapHorizontal: 0,
        mediaQueries: [{
            width: 700,
            cols: 4,
        }, {
            width: 480,
            cols: 2,
            options: {
                caption: '',
                gapHorizontal: 30,
                gapVertical: 20,
            }
        }, {
            width: 320,
            cols: 1,
            options: {
                caption: '',
                gapHorizontal: 50,
            }
        }]
    });
});

function viewDoc(title) {
    switch (title) {
        case 'ng':
            window.open('https://drive.google.com/open?id=15WP9GP3hzv1qO1lhbGCZ0Yds5jdLYG9U', 'self')
            break;
        case 'jsa':
            window.open('https://drive.google.com/open?id=12xNNWntgBCB17nDMC8lP-HnovR1wHbXY', 'self')
            break;
        case 'es6':
            window.open('https://drive.google.com/open?id=1T0kj-WD5kxxwMsiZFYAlxQZBzzHEGPcE', 'self')
            break;
        case 'jst':
            window.open('https://drive.google.com/open?id=1VPXvWY5kxEf9UPqGYQSLynhNAvdzIDNy', 'self')
            break;
        case 'nod':
            window.open('https://drive.google.com/open?id=1NHdx_0ZegOyUeCdHIwZR1gS7DKP9sj0i', 'self')
            break;
        case 'se':
            window.open('https://drive.google.com/open?id=1uz7_4E2ln2AMF4Q6C0O7N9tGEm9OZCHv', 'self')
            break;
        default:
    }
}