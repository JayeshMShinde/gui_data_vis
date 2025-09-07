"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Brain, Target, Layers, Zap, Lightbulb, Star } from "lucide-react";
import { trainModel, trainClustering, applyPCA, getMLRecommendations } from "@/lib/api";

type MLType = "supervised" | "clustering" | "pca";
type ModelType = "linear" | "random_forest" | "svm" | "knn" | "decision_tree";
type ClusteringAlgorithm = "kmeans" | "dbscan";

interface MLTrainingProps {
  sessionId: string;
  columns: string[];
  numericColumns: string[];
}

interface MLResult {
  model_type?: string;
  algorithm?: string;
  metrics?: any;
  labels?: number[];
  explained_variance_ratio?: number[];
  is_classification?: boolean;
}

export default function MLTraining({ sessionId, columns, numericColumns }: MLTrainingProps) {
  const [mlType, setMlType] = useState<MLType>("supervised");
  const [modelType, setModelType] = useState<ModelType>("random_forest");
  const [clusteringAlgorithm, setClusteringAlgorithm] = useState<ClusteringAlgorithm>("kmeans");
  const [targetColumn, setTargetColumn] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [nClusters, setNClusters] = useState<number>(3);
  const [nComponents, setNComponents] = useState<number>(2);
  const [testSize, setTestSize] = useState<number>(0.2);
  const [result, setResult] = useState<MLResult | null>(null);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);

  const { data: recommendations } = useQuery({
    queryKey: ["ml-recommendations", sessionId],
    queryFn: () => getMLRecommendations(sessionId),
    enabled: showRecommendations
  });

  const trainModelMutation = useMutation({
    mutationFn: async () => {
      if (mlType === "supervised") {
        return await trainModel({
          session_id: sessionId,
          model_type: modelType,
          target_column: targetColumn,
          feature_columns: selectedFeatures,
          test_size: testSize
        });
      } else if (mlType === "clustering") {
        return await trainClustering({
          session_id: sessionId,
          algorithm: clusteringAlgorithm,
          feature_columns: selectedFeatures,
          n_clusters: nClusters
        });
      } else if (mlType === "pca") {
        return await applyPCA({
          session_id: sessionId,
          feature_columns: selectedFeatures,
          n_components: nComponents
        });
      }
      throw new Error("Invalid ML type");
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success("Model training completed successfully!");
    },
    onError: (error) => {
      toast.error(`Training failed: ${error.message}`);
    }
  });

  const handleFeatureSelection = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, feature]);
    } else {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    }
  };

  const handleTrain = () => {
    if (selectedFeatures.length === 0) {
      toast.error("Please select at least one feature");
      return;
    }

    if (mlType === "supervised" && !targetColumn) {
      toast.error("Please select a target column");
      return;
    }

    trainModelMutation.mutate();
  };

  const getModelExplanation = () => {
    if (!result) return null;

    const explanations = {
      supervised: {
        linear: result.is_classification 
          ? "Logistic Regression found linear relationships between features to classify data into categories. Higher accuracy means better separation between classes."
          : "Linear Regression found a straight-line relationship between your features and target variable. R² score shows how well the line fits your data.",
        random_forest: result.is_classification
          ? "Random Forest created multiple decision trees and combined their votes for classification. This ensemble method reduces overfitting and improves accuracy."
          : "Random Forest built multiple decision trees to predict your target variable. The ensemble approach provides robust predictions by averaging tree outputs.",
        svm: result.is_classification
          ? "Support Vector Machine found the optimal boundary to separate different classes in your data using mathematical optimization."
          : "Support Vector Regression found the best-fitting line while allowing some tolerance for prediction errors.",
        knn: result.is_classification
          ? "K-Nearest Neighbors classified each data point based on the majority class of its nearest neighbors in the feature space."
          : "K-Nearest Neighbors predicted values by averaging the target values of the closest data points in the feature space.",
        decision_tree: result.is_classification
          ? "Decision Tree created a series of if-then rules based on your features to classify data into different categories."
          : "Decision Tree created branching rules based on feature values to predict your target variable."
      },
      clustering: {
        kmeans: `K-Means grouped your data into ${result.n_clusters || 'several'} clusters by finding points that are similar to each other and different from other groups.`,
        dbscan: "DBSCAN identified clusters of varying shapes and sizes while automatically detecting outliers as noise points."
      },
      pca: "PCA reduced the dimensionality of your data while preserving the most important patterns. It found the directions of maximum variance in your dataset."
    };

    let explanation = "";
    if (mlType === "supervised" && result.model_type) {
      explanation = explanations.supervised[result.model_type as keyof typeof explanations.supervised];
    } else if (mlType === "clustering" && result.algorithm) {
      explanation = explanations.clustering[result.algorithm as keyof typeof explanations.clustering];
    } else if (mlType === "pca") {
      explanation = explanations.pca;
    }

    return explanation;
  };

  const renderMetrics = () => {
    if (!result?.metrics) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm">Model Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {result.is_classification ? (
              <>
                <div>
                  <span className="font-medium">Accuracy:</span>
                  <div className="text-lg font-bold text-green-600">
                    {(result.metrics.accuracy * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <span className="font-medium">CV Score:</span>
                  <div className="text-lg font-bold">
                    {(result.metrics.cv_mean * 100).toFixed(2)}% ± {(result.metrics.cv_std * 100).toFixed(2)}%
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="font-medium">R² Score:</span>
                  <div className="text-lg font-bold text-blue-600">
                    {result.metrics.r2_score.toFixed(4)}
                  </div>
                </div>
                <div>
                  <span className="font-medium">RMSE:</span>
                  <div className="text-lg font-bold">
                    {result.metrics.rmse.toFixed(4)}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* ML Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Machine Learning Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>ML Type</Label>
            <Select value={mlType} onValueChange={(value: MLType) => setMlType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supervised">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Supervised Learning
                  </div>
                </SelectItem>
                <SelectItem value="clustering">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Clustering
                  </div>
                </SelectItem>
                <SelectItem value="pca">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    PCA
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Model/Algorithm Selection */}
          {mlType === "supervised" && (
            <div>
              <Label>Model Type</Label>
              <Select value={modelType} onValueChange={(value: ModelType) => setModelType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear/Logistic Regression</SelectItem>
                  <SelectItem value="random_forest">Random Forest</SelectItem>
                  <SelectItem value="svm">Support Vector Machine</SelectItem>
                  <SelectItem value="knn">K-Nearest Neighbors</SelectItem>
                  <SelectItem value="decision_tree">Decision Tree</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {mlType === "clustering" && (
            <div>
              <Label>Algorithm</Label>
              <Select value={clusteringAlgorithm} onValueChange={(value: ClusteringAlgorithm) => setClusteringAlgorithm(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kmeans">K-Means</SelectItem>
                  <SelectItem value="dbscan">DBSCAN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Target Column for Supervised Learning */}
          {mlType === "supervised" && (
            <div>
              <Label>Target Column</Label>
              <Select value={targetColumn} onValueChange={setTargetColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Feature Selection */}
          <div>
            <Label>Feature Columns</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
              {columns.filter(col => col !== targetColumn).map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={(checked) => 
                      handleFeatureSelection(feature, checked as boolean)
                    }
                  />
                  <Label htmlFor={`feature-${feature}`} className="text-xs truncate">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Parameters */}
          {mlType === "supervised" && (
            <div>
              <Label>Test Size</Label>
              <Input
                type="number"
                value={testSize.toString()}
                onChange={(e) => setTestSize(parseFloat(e.target.value) || 0.2)}
                min="0.1"
                max="0.5"
                step="0.1"
              />
            </div>
          )}

          {mlType === "clustering" && clusteringAlgorithm === "kmeans" && (
            <div>
              <Label>Number of Clusters</Label>
              <Input
                type="number"
                value={nClusters.toString()}
                onChange={(e) => setNClusters(parseInt(e.target.value) || 3)}
                min="2"
                max="10"
              />
            </div>
          )}

          {mlType === "pca" && (
            <div>
              <Label>Number of Components</Label>
              <Input
                type="number"
                value={nComponents.toString()}
                onChange={(e) => setNComponents(parseInt(e.target.value) || 2)}
                min="2"
                max={Math.min(10, selectedFeatures.length)}
              />
            </div>
          )}

          <Button 
            onClick={handleTrain}
            disabled={trainModelMutation.isPending}
            className="w-full"
          >
            {trainModelMutation.isPending ? "Training..." : "Train Model"}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="mb-4"
          >
            {showRecommendations ? "Hide" : "Show"} Recommendations
          </Button>
          
          {showRecommendations && recommendations && (
            <div className="space-y-4">
              {/* Target Recommendations */}
              {mlType === "supervised" && recommendations.target_recommendations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Recommended Target Columns
                  </h4>
                  <div className="space-y-2">
                    {recommendations.target_recommendations.slice(0, 3).map((rec: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="font-medium">{rec.column}</span>
                          <span className="text-xs px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded">
                            {rec.type}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setTargetColumn(rec.column)}
                          className="h-6 text-xs"
                        >
                          Use
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Feature Recommendations */}
              {recommendations.feature_recommendations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Recommended Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendations.feature_recommendations.slice(0, 8).map((rec: any, idx: number) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant={selectedFeatures.includes(rec.column) ? "default" : "outline"}
                        onClick={() => {
                          if (selectedFeatures.includes(rec.column)) {
                            setSelectedFeatures(selectedFeatures.filter(f => f !== rec.column));
                          } else {
                            setSelectedFeatures([...selectedFeatures, rec.column]);
                          }
                        }}
                        className="h-7 text-xs"
                      >
                        {rec.column}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Model Suggestions */}
              {recommendations.model_suggestions?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Suggested Models</h4>
                  <div className="space-y-1">
                    {recommendations.model_suggestions.map((rec: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                        <div>
                          <span className="font-medium capitalize">{rec.model.replace('_', ' ')}</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{rec.reason}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setModelType(rec.model)}
                          className="h-6 text-xs"
                        >
                          Use
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Explanation */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">What the Model Did</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getModelExplanation()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && renderMetrics()}

      {/* PCA Results */}
      {result && mlType === "pca" && result.explained_variance_ratio && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">PCA Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Explained Variance:</span>
              </div>
              {result.explained_variance_ratio.map((ratio, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>Component {idx + 1}:</span>
                  <span className="font-bold">{(ratio * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clustering Results */}
      {result && mlType === "clustering" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Clustering Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <span className="font-medium">Clusters Found:</span>
              <div className="text-lg font-bold text-purple-600">
                {result.labels ? Math.max(...result.labels) + 1 : 0}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}