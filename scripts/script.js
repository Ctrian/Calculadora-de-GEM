document.addEventListener('DOMContentLoaded', function () {

    // Seleccionamos todos los botones (tanto los del breadcrumb como los de "Siguiente")
    const botonesNavegacion = document.querySelectorAll('.tab-btn, .btn-siguiente');
    const contenidos = document.querySelectorAll('.tab-content');
    const tabsBreadcrumb = document.querySelectorAll('.tab-btn');

    botonesNavegacion.forEach(boton => {
        boton.addEventListener('click', function (e) {
            e.preventDefault();

            // 1. Obtener el ID del paso al que queremos ir
            const targetId = this.getAttribute('data-target') || this.getAttribute('data-next');

            // 2. Ocultar todos los contenidos
            contenidos.forEach(contenido => {
                contenido.classList.add('oculto');
            });

            // 3. Quitar la clase 'activo' de todos los botones del breadcrumb
            tabsBreadcrumb.forEach(tab => {
                tab.classList.remove('activo');
            });

            // 4. Mostrar el contenido objetivo
            document.getElementById(targetId).classList.remove('oculto');

            // 5. Marcar como activo el botón del breadcrumb correspondiente
            const tabCorrespondiente = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
            if (tabCorrespondiente) {
                tabCorrespondiente.classList.add('activo');
            }
        });
    });

    const selectTipo = document.getElementById('tipo_instalacion');
    const seccionZanja = document.getElementById('campos_zanja');
    const seccionVarilla = document.getElementById('campos_varilla');
    const btnCalcular = document.getElementById('btn_calcular');
    const boxResultado = document.getElementById('resultado_box');

    const txtVolumen = document.getElementById('res_volumen');
    const txtSacos = document.getElementById('res_sacos');

    const rendimientoSacoM3 = 0.014;

    selectTipo.addEventListener('change', function () {
        if (this.value === 'zanja') {
            seccionZanja.classList.remove('oculto');
            seccionVarilla.classList.add('oculto');
        } else if (this.value === 'varilla') {
            seccionVarilla.classList.remove('oculto');
            seccionZanja.classList.add('oculto');
        }

        boxResultado.classList.add('oculto');
    });

    btnCalcular.addEventListener('click', function (e) {
        e.preventDefault();

        let volumenTotalM3 = 0;
        const tipoActual = selectTipo.value;

        if (tipoActual === 'zanja') {
            const ancho = parseFloat(document.getElementById('z_ancho').value) / 100;
            const profundidad = parseFloat(document.getElementById('z_profundidad').value) / 100;
            const longitud = parseFloat(document.getElementById('z_longitud').value);

            volumenTotalM3 = ancho * profundidad * longitud;

        } else if (tipoActual === 'varilla') {
            const diametroM = parseFloat(document.getElementById('v_diametro').value) / 100;
            const longitudM = parseFloat(document.getElementById('v_longitud').value);

            const radio = diametroM / 2;
            volumenTotalM3 = Math.PI * Math.pow(radio, 2) * longitudM;
        }

        const sacosNecesarios = Math.ceil(volumenTotalM3 / rendimientoSacoM3);

        txtVolumen.textContent = volumenTotalM3.toFixed(4);
        txtSacos.textContent = sacosNecesarios;
        boxResultado.classList.remove('oculto');
    });
});