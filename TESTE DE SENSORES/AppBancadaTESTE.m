%% LEITURA DIRETA NO COMMAND WINDOW
clear; clc;

% 1. Conecta
d = daq("ni");
d.Rate = 1000;

% 2. Configura Canais (Modo SingleEnded para USB-6001)
ch1 = addinput(d, "Dev1", "ai0", "Voltage"); % Célula
ch1.TerminalConfig = "SingleEnded";
ch2 = addinput(d, "Dev1", "ai1", "Voltage"); % Pressão
ch2.TerminalConfig = "SingleEnded";

% 3. TARA (Lê o Zero)
fprintf('------------------------------------------\n');
fprintf('TARANDO... NÃO MEXA EM NADA (2 segundos)\n');
fprintf('------------------------------------------\n');
data0 = read(d, seconds(2), "OutputFormat", "Matrix");
ZeroForca = mean(data0(:,1));
ZeroPressao = mean(data0(:,2));

fprintf('Zero Definido. COLOQUE O PESO DE 5.4 KG AGORA.\n\n');

% 4. Loop de Leitura
while true
    % Lê média de 0.5 segundos (para o número não ficar pulando)
    data = read(d, seconds(0.5), "OutputFormat", "Matrix");
    
    % Calcula Variação (Valor Atual - Zero)
    Varia_Forca = mean(data(:,1)) - ZeroForca;
    Varia_Pressao = mean(data(:,2)) - ZeroPressao;
    
    % MOSTRA NO COMMAND WINDOW
    % Foca na coluna "DELTA FORÇA"
    fprintf('DELTA FORÇA: %.5f V  |  Delta Pressão: %.5f V\n', ...
        Varia_Forca, Varia_Pressao);
end