import { Calendar, Mail, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold hero-gradient bg-clip-text text-transparent">
                MeetSync
              </h3>
            </div>
            <p className="text-muted-foreground">
              La solution moderne pour organiser tous vos rendez-vous et réunions en toute simplicité.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Produit</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Intégrations</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/help" className="hover:text-foreground transition-colors">Centre d'aide</a></li>
              <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="/documentation" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="/status" className="hover:text-foreground transition-colors">Statut</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Nous suivre</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">
            © 2024 MeetSync. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Développé par</span>
            <span className="font-semibold hero-gradient bg-clip-text text-transparent">
              Soufian RAMZI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;