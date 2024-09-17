import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FixedExpenses from "./FixedExpenses";

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  paid: boolean;
}

interface TabCategoryProps {
  fixedExpenses: Expense[] | null; // Utiliser le type correct pour les données ou `null`
}

const TabCategory: React.FC<TabCategoryProps> = ({ fixedExpenses }) => {
  return (
    <Tabs defaultValue="charges">
      <TabsList>
        <TabsTrigger value="charges">Charges</TabsTrigger>
        <TabsTrigger value="variables">Variables</TabsTrigger>
      </TabsList>
      <TabsContent value="charges">
        {/* Vérifiez si `fixedExpenses` contient des données avant de rendre le composant */}
        {fixedExpenses && fixedExpenses.length > 0 ? (
          <FixedExpenses fixedExpenses={fixedExpenses} />
        ) : (
          <p>Chargement des charges fixes...</p> // Afficher un message de chargement ou autre
        )}
      </TabsContent>
      <TabsContent value="variables">Charges variables bientôt disponibles</TabsContent>
    </Tabs>
  );
};

export default TabCategory;
