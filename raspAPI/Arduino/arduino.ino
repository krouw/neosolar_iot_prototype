#include "EmonLib.h"                   // Incluimos la librería EmonLib.h
#include <Wire.h>

EnergyMonitor emon1;                   // Creamos una instancia
int potencia=0,n=0;

// VARIABLES GLOBALES   ///////////////////////////////////////////////////////////////////////////////////////
// FUNCIONES   ////////////////////////////////////////////////////////////////////////////////////////////////
void setup()
{
  emon1.current(1, 30);             // Current: pin de entrada A1, calibracion.
  /* Constante de corriente SCT-013-030 = 30A ÷ 1V = 30  ya lleva integrada la Burden Resistor
     Constante de corriente SCT-013-000 = (100 ÷ 0.050) ÷ 18 = 111.11    // 0.050A × 18R= 0.9V en Burden Resistor 18ohm  0.9V×100A= 111.1
  */
  Serial.begin(9600);
}

// PRINCIPAL   ////////////////////////////////////////////////////////////////////////////////////////////////
void loop()
{
  double Irms = emon1.calcIrms(1480);  // Calculamos Irms
  Serial.println(Irms);
  delay(800);

}
