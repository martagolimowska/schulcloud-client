$(document).ready(function () {

    var $modals = $('.modal');
    var $editModal = $('.edit-modal');

    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    var deleteCustomField = function (customFieldId) {
        $('#' + customFieldId).remove();
    };

    var populateCustomFields = function (modal, customFields) {
        var $customFields = modal.find('.custom-fields');
        _count = 0;
        customFields.forEach(function (field) {
            var _id = guidGenerator();
            var $field = $("<div id='" + _id + "'>Key: " + field.key + ", Value:" + field.value + "</div>")
                .append($("<input name='customs[" + _count + "][key]' value='" + field.key + "' style='display: none'></input>"))
                .append($("<input name='customs[" + _count + "][value]' value='" + field.value + "' style='display: none'></input>"))
                .append($("<i class='fa fa-trash-o' />")
                    .click(deleteCustomField.bind(this, _id))
                );
            $customFields.append($field);
        });
    };

    var populateCourseSelection = function (modal, courses) {
        var $selection = modal.find('.course-selection');
        courses.forEach(function (course) {
            var option = document.createElement("option");
            option.text = course.name;
            option.value = course._id;
            $selection.append(option);
        });
        $selection.chosen().trigger("chosen:updated");
    };

    var populateModalForm = function (modal, data) {

        var $title = modal.find('.modal-title');
        var $btnSubmit = modal.find('.btn-submit');
        var $btnClose = modal.find('.btn-close');
        var $form = modal.find('.modal-form');

        $title.html(data.title);
        $btnSubmit.html(data.submitLabel);
        $btnClose.html(data.closeLabel);

        // fields
        $('[name]', $form).not('[data-force-value]').each(function () {
            var value = (data.fields || {})[$(this).prop('name').replace('[]', '')] || '';
            switch ($(this).prop("type")) {
                case "radio":
                case "checkbox":
                    $(this).each(function () {
                        if ($(this).attr('value') == value) $(this).attr("checked", value);
                    });
                    break;
                default:
                    $(this).val(value).trigger("chosen:updated");
            }
        });
    };


    $('.template_tool').on('click', function (e) {
        e.preventDefault();
        var entry = $(this).attr('href');
        $.getJSON(entry, function (result) {
            populateModalForm($editModal, {
                title: 'Bearbeiten',
                closeLabel: 'Schließen',
                submitLabel: 'Speichern',
                fields: result.tool
            });
            populateCourseSelection($editModal, result.courses.data);
            populateCustomFields($editModal, result.tool.customs);
            $editModal.modal('show');
        });
    });

    $modals.find('.close, .btn-close').on('click', function () {
        $modals.modal('hide');
    });

});