import { useState } from "react";
import { Brain, AlertCircle, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface PredictionResult {
  disease: string;
  confidence: number;
  explanation: string;
  prescription: string;
  doctor: string;
  diagnostic_tests: string[];
}

const DiseasePrediction = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  const handlePredict = async () => {
    if (!symptoms.trim()) {
      toast.error("Please enter symptoms to analyze");
      return;
    }

    setIsLoading(true);
    setPredictions([]);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: symptoms.split(',').map(s => s.trim()) }),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction from AI model.");
      }

      const data = await response.json();
      setPredictions(data.predictions);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error during prediction:", error);
      toast.error("An error occurred while analyzing symptoms.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms("");
    setPredictions([]);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 glow">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Disease Prediction</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter your symptoms below and our AI will analyze them to provide possible disease predictions.
            </p>
          </div>

          {/* Input Section */}
          <Card className="glass card-elevated mb-8 animate-scale-in">
            <CardHeader>
              <CardTitle>Describe Your Symptoms</CardTitle>
              <CardDescription>
                Enter detailed information about your symptoms, including duration, severity, and any other relevant details. Separate symptoms with a comma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Example: headache, fever, body aches"
                className="min-h-[150px] resize-none bg-muted/50 border-border/50 focus:border-primary transition-colors"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handlePredict} 
                  disabled={isLoading}
                  variant="gradient"
                  size="lg"
                  className="flex-1"
                >
                  {isLoading ? "Analyzing..." : "Predict Disease"}
                </Button>
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  size="lg"
                >
                  Reset
                </Button>
              </div>

              <Alert className="glass border-primary/30">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm">
                  This is an AI-powered analysis tool. Results should not replace professional medical advice.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Results */}
          {!isLoading && predictions.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-center mb-6">
                Prediction Results
              </h2>
              
              {predictions.map((result, index) => (
                <Card 
                  key={index} 
                  className="glass card-elevated hover:scale-[1.01] transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{result.disease}</CardTitle>
                        <CardDescription>{result.explanation}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold gradient-text">
                          {result.confidence}%
                        </div>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Prescription
                        </h4>
                        <p className="text-sm text-muted-foreground">{result.prescription}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Doctor to Consult
                        </h4>
                        <p className="text-sm text-muted-foreground">{result.doctor}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Diagnostic Tests
                        </h4>
                        <ul className="space-y-2">
                          {result.diagnostic_tests.map((test, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-secondary mt-0.5">•</span>
                              <span>{test}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseasePrediction;