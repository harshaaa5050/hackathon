import { useState } from "react";
import { toast } from "sonner";
import { loginUser } from "@/services/auth";
import { loginSchema } from "@/lib/validations";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setForm((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // ✅ Zod validation
    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(form);

      // ✅ If using JWT
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Login successful 🎉");

      setForm({ email: "", password: "" });

      // 👉 redirect (if using react-router)
      // navigate("/dashboard");
    } catch (err) {
      const message =
        typeof err === "string" ? err : err?.message || "Login failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full justify-center items-center min-h-dvh">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription className="text-muted-foreground/60">
            Enter your details below
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* EMAIL */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  disabled={loading}
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={loading}
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 mt-6">
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? "Signing in..." : "Login"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => toast.info("Google login not implemented yet")}
            >
              Continue with Google
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
