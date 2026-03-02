document.addEventListener('DOMContentLoaded', function () {

    // 1. OBTENER ELEMENTOS DEL DOM
    const botonesNavegacion = document.querySelectorAll('.tab-btn, .btn-siguiente');
    const contenidos = document.querySelectorAll('.tab-content');
    const tabsBreadcrumb = document.querySelectorAll('.tab-btn');
    const panelInformativo = document.getElementById('panel-informativo'); // Panel de la derecha

    const selectTipo = document.getElementById('tipo_instalacion');
    const seccionZanja = document.getElementById('campos_zanja');
    const seccionVarilla = document.getElementById('campos_varilla');
    const btnCalcular = document.getElementById('btn_calcular');
    const boxResultado = document.getElementById('resultado_box');

    const txtVolumen = document.getElementById('res_volumen');
    const txtSacos = document.getElementById('res_sacos');

    const infoTitulo = document.getElementById('info-titulo');
    const infoDesc = document.getElementById('info-desc');
    const infoImg = document.getElementById('info-img');

    const rendimientoSacoM3 = 0.014;

    // 2. LÓGICA DE NAVEGACIÓN (TABS Y BOTÓN "SIGUIENTE")
    botonesNavegacion.forEach(boton => {
        boton.addEventListener('click', function (e) {
            e.preventDefault();

            // Obtener el ID del paso al que queremos ir
            const targetId = this.getAttribute('data-target') || this.getAttribute('data-next');

            // Ocultar todos los contenidos centrales
            contenidos.forEach(contenido => {
                contenido.classList.add('oculto');
            });

            // Quitar 'activo' de todos los botones del breadcrumb
            tabsBreadcrumb.forEach(tab => {
                tab.classList.remove('activo');
            });

            // Mostrar el contenido objetivo
            document.getElementById(targetId).classList.remove('oculto');

            // Marcar como activo el botón correspondiente
            const tabCorrespondiente = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
            if (tabCorrespondiente) {
                tabCorrespondiente.classList.add('activo');
            }

            // OCULTAR O MOSTRAR EL PANEL DERECHO
            if (targetId === 'paso-resumen') {
                panelInformativo.classList.add('oculto');
            } else {
                panelInformativo.classList.remove('oculto');
            }
        });
    });

    // 3. LÓGICA CONDICIONAL DE LA CALCULADORA (ZANJA VS VARILLA)
    selectTipo.addEventListener('change', function () {
        if (this.value === 'zanja') {
            seccionZanja.classList.remove('oculto');
            seccionVarilla.classList.add('oculto');

            // Actualizar Tarjeta Derecha para ZANJA
            infoTitulo.textContent = 'Horizontal grounding';
            infoDesc.textContent = 'A grounding system setup involves the installation of conductive materials in a horizontal arrangement to establish a low-resistance path...';
            infoImg.src = 'https://placehold.co/400x300/e2e8f0/475569?text=Imagen+Zanja';

        } else if (this.value === 'varilla') {
            seccionVarilla.classList.remove('oculto');
            seccionZanja.classList.add('oculto');

            // Actualizar Tarjeta Derecha para VARILLA
            infoTitulo.textContent = 'Vertical grounding';
            infoDesc.textContent = 'Vertical grounding involves driving conductive rods deep into the earth to reach lower resistivity soil layers...';
            infoImg.src = 'https://placehold.co/400x300/e2e8f0/475569?text=Imagen+Varilla';
        }

        boxResultado.classList.add('oculto');
    });

    // 4. LÓGICA MATEMÁTICA Y BOTÓN CALCULAR
    btnCalcular.addEventListener('click', function (e) {
        e.preventDefault();

        let volumenTotalM3 = 0;
        const tipoActual = selectTipo.value;
        let nombreConfiguracion = "";
        let srcImagenResumen = "";

        // Calcular según el tipo
        if (tipoActual === 'zanja') {
            const ancho = parseFloat(document.getElementById('z_ancho').value) / 100;
            const profundidad = parseFloat(document.getElementById('z_profundidad').value) / 100;
            const longitud = parseFloat(document.getElementById('z_longitud').value);

            volumenTotalM3 = ancho * profundidad * longitud;
            nombreConfiguracion = "Horizontal (Zanja)";
            srcImagenResumen = "https://placehold.co/400x300/e2e8f0/475569?text=Imagen+Zanja";

        } else if (tipoActual === 'varilla') {
            const diametroM = parseFloat(document.getElementById('v_diametro').value) / 100;
            const longitudM = parseFloat(document.getElementById('v_longitud').value);

            const radio = diametroM / 2;
            volumenTotalM3 = Math.PI * Math.pow(radio, 2) * longitudM;
            nombreConfiguracion = "Vertical (Varilla)";
            srcImagenResumen = "https://placehold.co/400x300/e2e8f0/475569?text=Imagen+Varilla";
        }

        const sacosNecesarios = Math.ceil(volumenTotalM3 / rendimientoSacoM3);

        // --- INYECTAR DATOS EN LA PESTAÑA SUMMARY ---
        document.getElementById('sum-config').textContent = nombreConfiguracion;
        document.getElementById('sum-vol').textContent = volumenTotalM3.toFixed(4);
        document.getElementById('sum-bags').textContent = sacosNecesarios;
        document.getElementById('summary-img').src = srcImagenResumen;

        // --- SALTO AUTOMÁTICO A RESUMEN ---
        document.querySelectorAll('.tab-content').forEach(contenido => {
            contenido.classList.add('oculto');
        });

        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('activo');
        });

        document.getElementById('paso-resumen').classList.remove('oculto');
        document.querySelector('.tab-btn[data-target="paso-resumen"]').classList.add('activo');

        // Ocultar el panel lateral derecho porque el Summary tiene su propio layout
        panelInformativo.classList.add('oculto');
    });
});