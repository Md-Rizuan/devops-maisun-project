var media_server = "{{ media_server }}";
var notyf = new Notyf({
    duration:4000
});

function successMessage(message_) {
    notyf.success(message_);
}

function errorMessage(message_) {
    notyf.error(message_);
}

var validate = function(e) {
    var t = e.value;
    if (t.includes("-")) {
        e.value = t.replace(/-/g, ""); 
    }
    
    if (t.indexOf(".") >= 0){
        e.value = t.slice(0, t.indexOf(".") + 3);
    }
}


function displayFileModal(fileUrl, fileName, heading, imageSrc) {
    $('#fileModal .modal-title').text(heading);

    let modalContent;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf') {
        modalContent = `<iframe src="${fileUrl}"  style="width: 100%; height: 80vh; max-height: 90vh; border: none;"  frameborder="0" allowfullscreen>
                        </iframe>`;
    } else {
        modalContent = `<img src="${fileUrl}" alt="${fileName}" style="width: 100%; max-height:81vh">`;
    }
   

    $('#fileModal .modal-body').html(modalContent);
    $('#fileModal').modal('show');
}
    
function validateImage(input, options = {}) {
    let { requiredWidth = null, requiredHeight = null, maxSizeMB = null } = options;

    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileInput = $(input);
        const reader = new FileReader();
        const img = new Image();

        reader.onload = function (e) {
            img.src = e.target.result;

            img.onload = function () {
                let isValid = true;

                if (requiredWidth !== null && requiredHeight !== null) {
                    if (img.naturalWidth !== requiredWidth || img.naturalHeight !== requiredHeight) {
                        errorMessage(`Image should be ${requiredWidth}x${requiredHeight} dimensions`);
                        isValid = false;
                    }
                }

                if (maxSizeMB !== null) {
                    const fileSizeMB = file.size / 1024 / 1024;
                    if (fileSizeMB > maxSizeMB) {
                        errorMessage(`Image size should not be more than ${maxSizeMB} MB`);
                        isValid = false;
                    }
                }

                if (isValid || (requiredWidth === null && requiredHeight === null && maxSizeMB === null)) {
                    fileInput.closest('.image_div').find('.preview_image').attr('src', e.target.result).show();
                } else {
                    $(input).val('');
                    fileInput.closest('.image_div').find('.preview_image').attr('src', '').hide();
                }
            };
        };

        reader.readAsDataURL(file);
    } else {
        $(input).closest('.image_div').find('.preview_image').attr('src', '').hide();
    }
}

function checkImageExtension(input) {
    const allowed_extensions = ["jpg", "jpeg", "png"];
    if (input.files && input.files[0]) {
        const fileName = input.files[0].name;
        const extension = fileName.split('.').pop().toLowerCase();
        if (!allowed_extensions.includes(extension)) {
            errorMessage("Select jpg, jpeg, png");
            $(input).val(''); 
            $(input).closest('.image_div').find('.preview_image').attr('src', '').hide();
            return false;
        }
    }
    return true;
}

function openImagesModal(title, images) {
    $('#images_modalLabel').text(title);
    $('#images_modal .modal-body').empty();
    
    images.forEach(function(image_url) {
        
        let img = $('<img>').attr('src',media_server + image_url).addClass('img-fluid');
        $('#images_modal .modal-body').append(img);
    });
    
    $('#images_modal').modal('show');
}

function isValidURL(url) {
    var regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(\.[a-zA-Z]{2,})(:[0-9]+)?(\/.*)?$/;
    return regex.test(url);
}

function IsValidFields(){
    let isValid = true;
    $(".error-message").remove();
    //let form_data = {};
    let form_data = new FormData();
    $(".required").each(function () {
        $(this).removeClass("error");
        if ($.trim($(this).val()).length === 0) {
            $(this).addClass("error");
            let error_message = $.trim($(this).siblings(".form-label").text());
            if (error_message.length === 0) {
                error_message = $.trim($(this).siblings().find(".form-label").text());
            }
            if (error_message.endsWith('*')) {
                error_message = error_message.slice(0, -1)
            } 
            if (error_message.length === 0) {
                error_message = $(this).data("error_text");
            }
            error_message = '<span class="error-message">' + error_message + ' is required</span>';
            if ($(this).siblings(".select2-container").length !== 0) {
                $(this).siblings(".select2-container").after(error_message);
                $(this).siblings(".select2").find(".select2-selection__rendered").addClass("error");
            } else {
                $(this).after(error_message);
            }
            isValid = false;
            $("html, body").animate({
                "scrollTop": $(this).offset().top - 150
            });
        }else{
            
            form_data.append($.trim($(this).attr("name")), $.trim($(this).val()));
        }
    });
    $(".optional").each(function(){
        form_data.append($.trim($(this).attr("name")), $.trim($(this).val()));
    });
    if(!isValid){
        form_data = {};
    }
    return {is_valid:isValid, form_data:form_data};
}


$(document).ready(function () {
    
    $(document).on('input keyup change paste', '.only_number', function () {
        const number__ = this;
        number__.value = number__.value.replace(/\D/g, '');
        setTimeout(function () {
            number__.value = number__.value.replace(/\D/g, '');
        }, 50);
    });

    $(document).on('input keyup change paste', '.required', function () {
        const theSelect2__ = $(this).siblings(".select2.select2-container.select2-container--default");
        $(this).removeClass("error");
        if (theSelect2__.length !== 0) {
            $(this).siblings(".select2.select2-container.select2-container--default").removeClass("error");
            $(this).siblings(".select2").find(".select2-selection__rendered").removeClass("error");
        }
        if ($(this).siblings(".error-message").length !== 0) {
            $(this).siblings(".error-message").remove();
        }
        
    });
    $(document).on('click', 'input[type="radio"]', function () {
        const radioGroup = $(this).closest('.required_radio');

        radioGroup.removeClass('error');
        radioGroup.find('.error-message').remove();
    });

    $(document).on('keypress keyup change paste', '.number_with_max', function() {
        const maxAllowed = parseFloat($(this).attr('max')) || Infinity;
    
        if (!this.lastValidValue) {
            this.lastValidValue = this.value;
        }
        
        if (parseFloat(this.value) > maxAllowed) {
            this.value = this.lastValidValue; 
        } else {
            this.lastValidValue = this.value;  
        }
    });
    
    $(document).on('input', '.count-characters', function () {
        const maxLength = parseFloat($(this).attr('maxlength')) || Infinity;
        let currentLength = $(this).val().length; 
        let countDiv = $(this).siblings('.count_div').find('.count');
    
        if (currentLength <= maxLength) {
            countDiv.text(currentLength + '/' + maxLength); 
        } else {
            $(this).val($(this).val().substring(0, maxLength)); 
            countDiv.text(maxLength + '/' + maxLength);
        }
    });
    

    $(document).on('change', 'input[type="file"]', function () {
        const input = $(this);

        if (input.attr('multiple')) {
            return;
        }

        const previewContainer = input.closest('.image_div').find('.image-preview');
        let heading = input.closest('.image_div').find('.file_label').text().replace('*', '').replace('স্বাক্ষর সহিত আপলোড করুন', '').trim();
       
        if (heading.length == 0){
            heading = input.data('error_text');
        }
        const allowedExtensions = ['pdf', 'png', 'jpeg', 'jpg'];
        previewContainer.empty(); 

        if (input[0].files && input[0].files.length > 0) {
            const files_number = input[0].files.length;
            const existing = input.siblings('.existing');
            const file_count = existing.length || 0; 
            const total_file_count = file_count + files_number;

            if ( total_file_count > 5) {
                errorMessage("পাঁচটির অধিক ফাইল আপলোড করা যাবে না");
                input.val('');
                $(input).closest('.image_div').find('.preview_image').attr('src', '').hide();
                return false;
            }
            
            Array.from(input[0].files).forEach((file, index) => {
                const fileName = file.name;
                const fileUrl = URL.createObjectURL(file);
                const fileExtension = fileName.split('.').pop().toLowerCase();

                if (!allowedExtensions.includes(fileExtension)) {
                    errorMessage("সঠিক ফাইল টাইপ নির্বাচন করুন");
                    input.val('');
                    $(input).closest('.image_div').find('.preview_image').attr('src', '').hide();
                    return false;
                }
                const fileSizeMB = file.size / 1024 / 1024;
                if (input.hasClass('three_mb')) {
                    if (fileSizeMB > 3) {
                        errorMessage(`ফাইলের সাইজ সর্বোচ্চ ৩ মেগাবাইট (MB) হতে পারবে`);
                        input.val('');
                        $(input).closest('.image_div').find('.preview_image').attr('src', '').hide(); 
                        return false;
                    }
                } else {
                    
                    if (fileSizeMB > 1) {
                        errorMessage(`ফাইলের সাইজ সর্বোচ্চ ১ মেগাবাইট (MB) হতে পারবে`);
                        input.val(''); 
                        $(input).closest('.image_div').find('.preview_image').attr('src', '').hide(); 
                        return false; 
                    }
                }
                
                
                let removeButton = `
                    <div>
                        <button class="remove-file-button mx-2" data-index="${index}" style="">&times;</button>
                    </div>`;
                
                
                const file_ = `
                    <div class='d-flex pb-2'>
                        <div class="file-name" data-index="${index}" data-file-url="${fileUrl}" data-heading="${heading}" data-file-name="${fileName}">
                            <span class="preview_title" style="cursor: pointer; text-decoration: none; color: blue;">${fileName}</span>
                        
                        </div>
                        ${removeButton}
                    </div>`;
                previewContainer.append(file_);
            });
        }
    });
    
    $(document).on('click', '.file-name', function () {
        const fileUrl = $(this).data('file-url');
        const fileName = $(this).data('file-name');
        const heading = $(this).data('heading');
        displayFileModal(fileUrl, fileName, heading);
    });

    function updateInputFiles(input, files_array) {
        const dataTransfer = new DataTransfer();

        files_array.forEach(function (file) {
            dataTransfer.items.add(file);
        });

        input.files = dataTransfer.files; 
    }

    $(document).on('click', '.remove-file-button', function () {
        const filePreview = $(this).closest('.d-flex');
        const input = filePreview.closest('.image_div').find('input[type="file"]');
        let files_array = Array.from(input[0].files);
        let file_index = filePreview.index(); 
        let fileIndexOnArray = $(this).data('index'); 
        if (file_index > -1 && fileIndexOnArray > -1) {
            files_array.splice(file_index, 1); 
        
            filePreview.remove();
            updateInputFiles(input[0], files_array);
        }
    });

    $(document).on('click', '.sidemenu-toggle', function(){
        $("#top-client-name").hide();
    })
    $(document).on('click', '#side-head-close', function(){
        $("#top-client-name").show();
    })


   
    const toggleButton = document.querySelector(".sidemenu-toggle");
    const topClientName = document.getElementById("top-client-name");
    
    $(document).on("click", ".sidemenu-toggle", function () {
        const isMenuOpen = toggleButton.classList.contains("menu-open");

        if (isMenuOpen) {
            toggleButton.classList.remove("menu-open");
            if (topClientName) topClientName.style.display = "block";
        } else {
            toggleButton.classList.add("menu-open");
            if (topClientName) topClientName.style.display = "none";
        }
    });
   
    $(document).on("click", ".read_reason", function () {
        const fullMessage = $(this).data('message');
        const label = $(this).data('label');
       
        $(this).html("<p>"+ label +  ": " + fullMessage + "</p>");
    });

   
    $(document).on("click", ".read-more", function () {
        const fullMessage = $(this).data('message');
        $(this).parent().text("বাতিলের কারনঃ " + fullMessage);
    });
    
    
});