import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminSave } from "@/hooks/useAdminSave";

interface PaymentSettings {
  paymentText: string;
  paymentLink: string;
  showBookingSection: boolean;
}

const PaymentManagement = () => {
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    paymentText: "Meetings are Free. Work outside of meetings are billed at £20 per hour.",
    paymentLink: "https://buy.stripe.com/9AQ9Cv4mm2HgcEgcMM",
    showBookingSection: true,
  });
  const [initialSettings, setInitialSettings] = useState<PaymentSettings>({
    paymentText: "Meetings are Free. Work outside of meetings are billed at £20 per hour.",
    paymentLink: "https://buy.stripe.com/9AQ9Cv4mm2HgcEgcMM",
    showBookingSection: true,
  });
  const { toast } = useToast();

  // Save function for the hook
  const savePaymentSettings = async () => {
    try {
      // Save payment text and link
      const { error: textError } = await supabase
        .from('admin_settings')
        .upsert(
          { setting_name: 'payment_text', setting_value: paymentSettings.paymentText },
          { onConflict: 'setting_name' }
        );

      if (textError) throw textError;

      const { error: linkError } = await supabase
        .from('admin_settings')
        .upsert(
          { setting_name: 'payment_link', setting_value: paymentSettings.paymentLink },
          { onConflict: 'setting_name' }
        );

      if (linkError) throw linkError;

      // Save booking section visibility
      const { error: bookingError } = await supabase
        .from('admin_settings')
        .upsert(
          { setting_name: 'show_booking_section', setting_value: paymentSettings.showBookingSection },
          { onConflict: 'setting_name' }
        );

      if (bookingError) throw bookingError;

      setInitialSettings({ ...paymentSettings });
    } catch (error) {
      console.error('Error saving payment settings:', error);
      throw error;
    }
  };

  // Register with admin save system
  const hasChanges = JSON.stringify(paymentSettings) !== JSON.stringify(initialSettings);
  useAdminSave(savePaymentSettings, [hasChanges]);

  // Load payment settings from Supabase
  const loadPaymentSettings = async () => {
    try {
      const { data: settings, error } = await supabase
        .from('admin_settings')
        .select('setting_name, setting_value')
        .in('setting_name', ['payment_text', 'payment_link', 'show_booking_section']);

      if (error) throw error;

      if (settings && settings.length > 0) {
        const newSettings = { ...paymentSettings };
        
        settings.forEach(setting => {
          switch (setting.setting_name) {
            case 'payment_text':
              newSettings.paymentText = setting.setting_value as string;
              break;
            case 'payment_link':
              newSettings.paymentLink = setting.setting_value as string;
              break;
            case 'show_booking_section':
              newSettings.showBookingSection = setting.setting_value as boolean;
              break;
          }
        });

        setPaymentSettings(newSettings);
        setInitialSettings(newSettings);
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
      toast({
        title: "Error",
        description: "Failed to load payment settings",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const updatePaymentText = (value: string) => {
    setPaymentSettings(prev => ({ ...prev, paymentText: value }));
  };

  const updatePaymentLink = (value: string) => {
    setPaymentSettings(prev => ({ ...prev, paymentLink: value }));
  };

  const toggleBookingSection = (checked: boolean) => {
    setPaymentSettings(prev => ({ ...prev, showBookingSection: checked }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment & Booking Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Show Booking Section Toggle */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
          <Switch
            checked={paymentSettings.showBookingSection}
            onCheckedChange={toggleBookingSection}
            className="h-4 w-7"
          />
          <Label className="text-sm font-medium">Show Booking Section</Label>
        </div>

        {/* Payment Text */}
        <div className="space-y-2">
          <Label htmlFor="paymentText">Payment Description Text</Label>
          <Textarea
            id="paymentText"
            placeholder="Enter payment description text..."
            value={paymentSettings.paymentText}
            onChange={(e) => updatePaymentText(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Payment Link */}
        <div className="space-y-2">
          <Label htmlFor="paymentLink">Payment Link URL</Label>
          <Input
            id="paymentLink"
            type="url"
            placeholder="https://buy.stripe.com/..."
            value={paymentSettings.paymentLink}
            onChange={(e) => updatePaymentLink(e.target.value)}
          />
        </div>

        {/* Preview */}
        {paymentSettings.showBookingSection && (
          <div className="mt-6 p-4 border rounded-lg bg-background">
            <Label className="text-sm font-medium text-muted-foreground">Preview:</Label>
            <div className="mt-2 text-center">
              <p className="text-muted-foreground mb-4">{paymentSettings.paymentText}</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button size="sm" className="bg-gray-800 text-white hover:bg-gray-700">
                  Book a Free Meeting
                </Button>
                <Button size="sm" variant="outline" className="border-2">
                  Payment Link
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentManagement;