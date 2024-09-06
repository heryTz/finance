import { routes } from "@/app/routes";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { genTitle } from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: genTitle("Vérification"),
};

export default function VerifyRequestPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Vérifiez votre email</CardTitle>
        <CardDescription>
          Un lien de connexion a été envoyé à votre adresse e-mail.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link
          className={buttonVariants({ className: "w-full" })}
          href={routes.dashboard()}
        >
          Entrer dans le dashboard
        </Link>
      </CardFooter>
    </Card>
  );
}
