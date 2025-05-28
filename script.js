document.addEventListener('DOMContentLoaded', () => {
    // Bar weight data (kg per meter)
    const mainBarWeights = {
        '12': 0.928,
        '16': 1.649,
        '20': 2.577,
        '24': 3.711
    };

    const ligatureWeights = {
        '6': 0.400,
        '10': 0.644,
        '12': 0.928,
        '16': 1.649
    };

    // Get DOM elements
    // Pricing Parameters
    const mainBarPricePerTonneInput = document.getElementById('mainBarPricePerTonne');
    const ligaturePricePerTonneInput = document.getElementById('ligaturePricePerTonne');
    const processingCostPerTonneInput = document.getElementById('processingCostPerTonne');

    // Main Bars
    const mainBarDiameterSelect = document.getElementById('mainBarDiameter');
    const mainBarLengthInput = document.getElementById('mainBarLength');
    const numMainBarsInput = document.getElementById('numMainBars');
    const mainBarTotalWeightSpan = document.getElementById('mainBarTotalWeight');
    const mainBarCostSpan = document.getElementById('mainBarCost');

    // Ligatures/Hoops Controls
    const useHoopsCheckbox = document.getElementById('useHoops');
    const ligatureInputSection = document.getElementById('ligatureInputSection');
    const hoopInputSection = document.getElementById('hoopInputSection');

    // Ligatures
    const ligatureDiameterSelect = document.getElementById('ligatureDiameter');
    const ligatureDim1Input = document.getElementById('ligatureDim1');
    const ligatureDim2Input = document.getElementById('ligatureDim2');
    
    // Hoops
    const hoopDiameterInput = document.getElementById('hoopDiameterInput'); // New input for hoop diameter

    const numLigaturesInput = document.getElementById('numLigatures');
    const ligaturePerLengthSpan = document.getElementById('ligaturePerLength');
    const ligatureTotalWeightSpan = document.getElementById('ligatureTotalWeight');
    const ligatureCostSpan = document.getElementById('ligatureCost');

    // Processing Cost Summary
    const totalMaterialWeightSpan = document.getElementById('totalMaterialWeight');
    const processingCostSpan = document.getElementById('processingCost');

    // Total Cost
    const calculateBtn = document.getElementById('calculateBtn');
    const totalCostSpan = document.getElementById('totalCost');

    // Function to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    // Function to format weight
    const formatWeight = (value) => {
        return `${value.toFixed(2)} kg`;
    };

    const formatLength = (value) => {
        return `${value.toFixed(0)} mm`;
    };

    // Function to toggle visibility of ligature/hoop input sections
    const toggleLigatureHoopInputs = () => {
        if (useHoopsCheckbox.checked) {
            ligatureInputSection.style.display = 'none';
            hoopInputSection.style.display = 'block';
        } else {
            ligatureInputSection.style.display = 'block';
            hoopInputSection.style.display = 'none';
        }
        calculateCost(); // Recalculate when the mode changes
    };

    const calculateCost = () => {
        // --- Main Bars Calculation ---
        const mainBarDiameter = parseFloat(mainBarDiameterSelect.value) || 0;
        const mainBarLength = parseFloat(mainBarLengthInput.value) || 0; // in mm
        const mainBarPricePerTonne = parseFloat(mainBarPricePerTonneInput.value) || 0;
        const numMainBars = parseFloat(numMainBarsInput.value) || 0;

        const mainBarWeightPerMeter = mainBarWeights[String(mainBarDiameter)]; 
        
        let totalMainBarWeight = 0;
        let mainBarCost = 0;

        if (mainBarWeightPerMeter && numMainBars > 0 && mainBarLength > 0) {
            totalMainBarWeight = (mainBarLength / 1000) * mainBarWeightPerMeter * numMainBars; // in kg
            mainBarCost = (totalMainBarWeight / 1000) * mainBarPricePerTonne; // in $
        }
        mainBarTotalWeightSpan.textContent = formatWeight(totalMainBarWeight);
        mainBarCostSpan.textContent = formatCurrency(mainBarCost);

        // --- Ligatures/Hoops Calculation ---
        const ligatureDiameter = parseFloat(ligatureDiameterSelect.value) || 0;
        const ligaturePricePerTonne = parseFloat(ligaturePricePerTonneInput.value) || 0;
        const numLigatures = parseFloat(numLigaturesInput.value) || 0;

        const ligatureWeightPerMeter = ligatureWeights[String(ligatureDiameter)];

        let singleLigatureLength = 0; // in mm
        let totalLigatureWeight = 0;
        let ligatureCost = 0;

        if (useHoopsCheckbox.checked) {
            // Hoops calculation
            const hoopDiameter = parseFloat(hoopDiameterInput.value) || 0;
            if (hoopDiameter > 0) {
                singleLigatureLength = (hoopDiameter * Math.PI) + 200; // Diameter * PI (circumference) + 200mm (for overlap/ties)
            }
        } else {
            // Ligatures calculation (original)
            const ligatureDim1 = parseFloat(ligatureDim1Input.value) || 0; // in mm
            const ligatureDim2 = parseFloat(ligatureDim2Input.value) || 0; // in mm
            if (ligatureDim1 > 0 && ligatureDim2 > 0) {
                singleLigatureLength = (ligatureDim1 * 2) + (ligatureDim2 * 2) + 200; // (2x Dim1 + 2x Dim2) + 200mm
            }
        }
        
        if (ligatureWeightPerMeter && numLigatures > 0 && singleLigatureLength > 0) {
            totalLigatureWeight = (singleLigatureLength / 1000) * ligatureWeightPerMeter * numLigatures; // in kg
            ligatureCost = (totalLigatureWeight / 1000) * ligaturePricePerTonne; // in $
        }
        ligaturePerLengthSpan.textContent = formatLength(singleLigatureLength);
        ligatureTotalWeightSpan.textContent = formatWeight(totalLigatureWeight);
        ligatureCostSpan.textContent = formatCurrency(ligatureCost);

        // --- Processing Cost Calculation ---
        const processingCostPerTonne = parseFloat(processingCostPerTonneInput.value) || 0;

        const totalMaterialWeight = totalMainBarWeight + totalLigatureWeight;
        let processingCost = 0;

        if (totalMaterialWeight > 0) {
            processingCost = (totalMaterialWeight / 1000) * processingCostPerTonne; // in $
        }
        totalMaterialWeightSpan.textContent = formatWeight(totalMaterialWeight);
        processingCostSpan.textContent = formatCurrency(processingCost);

        // --- Total Cage Cost ---
        const totalCageCost = mainBarCost + ligatureCost + processingCost;
        totalCostSpan.textContent = formatCurrency(totalCageCost);
    };

    // Add event listener to the checkbox
    useHoopsCheckbox.addEventListener('change', toggleLigatureHoopInputs);

    // Get all inputs and selects for dynamic recalculation
    const allInputsAndSelects = document.querySelectorAll(
        'input[type="number"], select'
    );

    allInputsAndSelects.forEach(element => {
        element.addEventListener('input', calculateCost);
        element.addEventListener('change', calculateCost); // For select and checkbox elements
    });

    // Initial call to set correct visibility and calculate on page load
    toggleLigatureHoopInputs(); 
});