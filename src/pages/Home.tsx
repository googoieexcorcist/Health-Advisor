import { Link } from "react-router-dom";
import { Brain, FileSearch, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-medical.jpg";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning algorithms analyze symptoms to provide accurate disease predictions with confidence scores.",
      delay: 0,
    },
    {
      icon: FileSearch,
      title: "Report Analysis",
      description: "Upload medical reports and receive instant AI-driven analysis with detailed insights and recommendations.",
      delay: 100,
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your medical data is encrypted and processed with the highest security standards to ensure complete privacy.",
      delay: 200,
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get real-time predictions and analysis results in seconds, enabling faster medical decision-making.",
      delay: 300,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Advanced <span className="gradient-text">Medical AI</span>
              <br />
              for Healthcare
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Leverage cutting-edge artificial intelligence to predict diseases and analyze medical reports with unprecedented accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="gradient" size="lg" className="text-lg">
                <Link to="/predict">Start Prediction</Link>
              </Button>
              <Button asChild variant="gradient" size="lg" className="text-lg">
                <Link to="/report">Analyze Report</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines advanced AI technology with medical expertise to deliver professional-grade results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass card-elevated rounded-2xl p-12 text-center animate-scale-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience the Future of Medical AI?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join healthcare professionals worldwide who trust Health Advisor for accurate predictions and analysis.
            </p>
            <Button asChild variant="gradient" size="lg" className="text-lg">
              <Link to="/predict">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="py-10 border-t border-border/50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Disclaimer: This tool is for educational and informational purposes only. 
            Always consult with qualified healthcare professionals for medical advice and diagnosis.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
