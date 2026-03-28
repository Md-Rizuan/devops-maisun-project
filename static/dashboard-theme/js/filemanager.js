(function () {
    "use strict";

    /**** Filepond js****/
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageExifOrientation,
        FilePondPluginFileValidateSize,
        FilePondPluginImageEdit
    );

    const MultipleElement = document.querySelector('.multiple-filepond');
    FilePond.create(MultipleElement,);


})();